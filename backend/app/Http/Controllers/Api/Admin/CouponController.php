<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Coupon;
use Illuminate\Http\Request;

class CouponController extends Controller
{
    public function index()
    {
        return response()->json(Coupon::latest()->paginate(20));
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'code' => 'required|string|unique:coupons,code',
            'type' => 'required|in:percentual,valor_fixo,frete_gratis',
            'value' => 'nullable|numeric',
            'min_purchase_value' => 'nullable|numeric',
            'max_uses' => 'nullable|integer',
            'valid_from' => 'nullable|date',
            'valid_until' => 'nullable|date',
            'active' => 'boolean',
        ]);
        $data['code'] = strtoupper($data['code']);

        return response()->json(Coupon::create($data), 201);
    }

    public function update(Request $request, int $id)
    {
        $coupon = Coupon::findOrFail($id);
        $coupon->update($request->all());

        return response()->json($coupon);
    }

    public function destroy(int $id)
    {
        Coupon::findOrFail($id)->delete();

        return response()->json(['message' => 'Cupom removido.']);
    }
}
