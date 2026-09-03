<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\Request;

class OrderController extends Controller
{
    public function index(Request $request)
    {
        $query = Order::with(['user', 'items']);
        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        return response()->json($query->latest()->paginate(20));
    }

    public function show(int $id)
    {
        return response()->json(Order::with(['user', 'items', 'address'])->findOrFail($id));
    }

    // Atualiza status (novo -> pago -> separacao -> enviado -> entregue / cancelado)
    // e permite cadastrar o codigo de rastreio apos a postagem.
    public function update(Request $request, int $id)
    {
        $data = $request->validate([
            'status' => 'sometimes|in:novo,pago,separacao,enviado,entregue,cancelado',
            'tracking_code' => 'sometimes|nullable|string',
        ]);

        $order = Order::findOrFail($id);
        $order->update($data);

        // Ao enviar, se houver rastreio, o cliente ja consegue ver na area dele.
        return response()->json($order);
    }
}
