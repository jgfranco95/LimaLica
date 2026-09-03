<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Address;
use App\Models\Coupon;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\ProductVariant;
use App\Models\StockMovement;
use App\Services\MercadoPagoService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class CheckoutController extends Controller
{
    public function __construct(protected MercadoPagoService $mercadoPago) {}

    /**
     * Cria o pedido (status "novo") e devolve os dados de pagamento do
     * Mercado Pago (Pix -> QR code, Cartao -> preference/checkout).
     * O pedido so muda para "pago" quando o webhook confirmar o pagamento.
     */
    public function store(Request $request)
    {
        $data = $request->validate([
            'address_id' => 'required|exists:addresses,id',
            'payment_method' => 'required|in:pix,credit_card,debit_card',
            'coupon_code' => 'nullable|string',
            'shipping_cost' => 'required|numeric|min:0',
            'items' => 'required|array|min:1',
            'items.*.variant_id' => 'required|exists:product_variants,id',
            'items.*.quantity' => 'required|integer|min:1',
        ]);

        $user = $request->user();
        $address = Address::where('user_id', $user->id)->findOrFail($data['address_id']);

        return DB::transaction(function () use ($data, $user, $address) {
            $subtotal = 0;
            $itemsToCreate = [];

            // Trava as linhas de estoque (lockForUpdate) para evitar overselling
            // em compras simultaneas do mesmo produto.
            foreach ($data['items'] as $item) {
                $variant = ProductVariant::with('product')
                    ->lockForUpdate()->findOrFail($item['variant_id']);

                if ($variant->stock < $item['quantity']) {
                    abort(422, "Produto \"{$variant->product->name}\" sem estoque suficiente.");
                }

                $unitPrice = $variant->product->currentPrice();
                $subtotal += $unitPrice * $item['quantity'];

                $itemsToCreate[] = [
                    'variant' => $variant,
                    'product_name' => $variant->product->name,
                    'unit_price' => $unitPrice,
                    'quantity' => $item['quantity'],
                ];
            }

            $discount = 0;
            $coupon = null;
            if (! empty($data['coupon_code'])) {
                $coupon = Coupon::where('code', strtoupper($data['coupon_code']))->first();
                if ($coupon && $coupon->isValid($subtotal)) {
                    $discount = $coupon->calculateDiscount($subtotal);
                } else {
                    $coupon = null;
                }
            }

            $shippingCost = $coupon?->type === 'frete_gratis' ? 0 : $data['shipping_cost'];
            $total = max(0, $subtotal - $discount + $shippingCost);

            $order = Order::create([
                'order_number' => 'LL-'.strtoupper(Str::random(8)),
                'user_id' => $user->id,
                'address_id' => $address->id,
                'coupon_id' => $coupon?->id,
                'subtotal' => $subtotal,
                'discount' => $discount,
                'shipping_cost' => $shippingCost,
                'total' => $total,
                'payment_method' => $data['payment_method'],
                'status' => 'novo',
            ]);

            foreach ($itemsToCreate as $item) {
                OrderItem::create([
                    'order_id' => $order->id,
                    'product_variant_id' => $item['variant']->id,
                    'product_name' => $item['product_name'],
                    'unit_price' => $item['unit_price'],
                    'quantity' => $item['quantity'],
                ]);
                // Estoque so e efetivamente baixado quando o pagamento e
                // aprovado (ver StockService::deductForOrder no webhook),
                // para nao travar estoque de pedidos que nunca sao pagos.
            }

            $coupon?->increment('used_count');

            $paymentData = $this->mercadoPago->createPayment($order, $user, $address);

            return response()->json([
                'order' => $order->load('items'),
                'payment' => $paymentData,
            ], 201);
        });
    }

    // Webhook chamado pelo Mercado Pago quando o status do pagamento muda
    public function webhook(Request $request)
    {
        $paymentId = $request->input('data.id');
        if (! $paymentId) {
            return response()->json(['ignored' => true]);
        }

        $status = $this->mercadoPago->getPaymentStatus($paymentId);
        $order = Order::where('mp_payment_id', $paymentId)->first();

        if (! $order || $status !== 'approved' || $order->status !== 'novo') {
            return response()->json(['ok' => true]);
        }

        DB::transaction(function () use ($order) {
            $order->update(['status' => 'pago']);

            foreach ($order->items as $item) {
                $variant = ProductVariant::lockForUpdate()->find($item->product_variant_id);
                if (! $variant) {
                    continue;
                }

                $variant->decrement('stock', $item->quantity);

                StockMovement::create([
                    'product_variant_id' => $variant->id,
                    'type' => 'venda',
                    'quantity' => -$item->quantity,
                    'reason' => "Pedido {$order->order_number}",
                ]);
            }

            // Aqui entraria o envio de e-mail de confirmacao:
            // Mail::to($order->user)->send(new OrderConfirmed($order));
        });

        return response()->json(['ok' => true]);
    }
}
