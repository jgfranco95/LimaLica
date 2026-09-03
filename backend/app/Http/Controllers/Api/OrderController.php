<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\Request;

class OrderController extends Controller
{
    // Pedidos do cliente logado (area do cliente)
    public function index(Request $request)
    {
        return response()->json(
            Order::with('items')->where('user_id', $request->user()->id)
                ->latest()->paginate(10)
        );
    }

    public function show(Request $request, int $id)
    {
        $order = Order::with(['items', 'address'])
            ->where('user_id', $request->user()->id)->findOrFail($id);

        return response()->json($order);
    }
}
