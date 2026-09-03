<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\ProductVariant;
use App\Models\StockMovement;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class StockController extends Controller
{
    // Historico de movimentacoes (entrada/saida/ajuste/venda)
    public function index(Request $request)
    {
        $query = StockMovement::with('variant.product')->latest();
        if ($request->filled('variant_id')) {
            $query->where('product_variant_id', $request->variant_id);
        }

        return response()->json($query->paginate(30));
    }

    // Entrada, saida manual ou ajuste de estoque
    public function store(Request $request)
    {
        $data = $request->validate([
            'product_variant_id' => 'required|exists:product_variants,id',
            'type' => 'required|in:entrada,saida,ajuste',
            'quantity' => 'required|integer',
            'reason' => 'nullable|string',
        ]);

        return DB::transaction(function () use ($data, $request) {
            $variant = ProductVariant::lockForUpdate()->findOrFail($data['product_variant_id']);

            $delta = match ($data['type']) {
                'entrada' => abs($data['quantity']),
                'saida' => -abs($data['quantity']),
                'ajuste' => $data['quantity'], // pode ser positivo ou negativo
            };

            $newStock = $variant->stock + $delta;
            if ($newStock < 0) {
                abort(422, 'Estoque nao pode ficar negativo.');
            }

            $variant->update(['stock' => $newStock]);

            $movement = StockMovement::create([
                'product_variant_id' => $variant->id,
                'type' => $data['type'],
                'quantity' => $delta,
                'reason' => $data['reason'] ?? null,
                'user_id' => $request->user()->id,
            ]);

            return response()->json($movement, 201);
        });
    }
}
