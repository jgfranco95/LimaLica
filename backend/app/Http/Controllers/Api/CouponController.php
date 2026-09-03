<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Coupon;
use Illuminate\Http\Request;

class CouponController extends Controller
{
    // Valida um cupom para o subtotal atual do carrinho (chamado do carrinho/checkout)
    public function validateCoupon(Request $request)
    {
        $request->validate(['code' => 'required|string', 'subtotal' => 'required|numeric']);

        $coupon = Coupon::where('code', strtoupper($request->code))->first();

        if (! $coupon || ! $coupon->isValid((float) $request->subtotal)) {
            return response()->json(['message' => 'Cupom invalido ou expirado.'], 422);
        }

        return response()->json([
            'coupon' => $coupon,
            'discount' => $coupon->calculateDiscount((float) $request->subtotal),
            'free_shipping' => $coupon->type === 'frete_gratis',
        ]);
    }
}
