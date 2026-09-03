<?php

namespace App\Services;

use App\Models\Address;
use App\Models\Order;
use App\Models\User;
use MercadoPago\Client\Payment\PaymentClient;
use MercadoPago\MercadoPagoConfig;

/**
 * Encapsula a integracao com o SDK oficial do Mercado Pago
 * (mercadopago/dx-php). Suporta Pix (pagamento direto com QR code)
 * e Cartao (preference / checkout transparente).
 */
class MercadoPagoService
{
    public function __construct()
    {
        MercadoPagoConfig::setAccessToken(config('services.mercadopago.access_token'));
    }

    public function createPayment(Order $order, User $user, Address $address): array
    {
        $client = new PaymentClient;

        $payload = [
            'transaction_amount' => (float) $order->total,
            'description' => "Pedido {$order->order_number} - Lima Lica",
            'payment_method_id' => $order->payment_method === 'pix' ? 'pix' : null,
            'payer' => [
                'email' => $user->email,
                'first_name' => explode(' ', $user->name)[0] ?? $user->name,
            ],
            'external_reference' => $order->order_number,
            'notification_url' => config('app.url').'/api/webhooks/mercadopago',
        ];

        $payment = $client->create(array_filter($payload));

        $order->update(['mp_payment_id' => $payment->id]);

        return [
            'id' => $payment->id,
            'status' => $payment->status,
            'qr_code' => $payment->point_of_interaction->transaction_data->qr_code ?? null,
            'qr_code_base64' => $payment->point_of_interaction->transaction_data->qr_code_base64 ?? null,
            'ticket_url' => $payment->point_of_interaction->transaction_data->ticket_url ?? null,
        ];
    }

    public function getPaymentStatus(string $paymentId): string
    {
        $client = new PaymentClient;
        $payment = $client->get($paymentId);

        return $payment->status;
    }
}
