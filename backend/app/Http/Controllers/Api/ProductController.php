<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    // Listagem com filtros: tamanho, cor, faixa de preco, marca, genero, disponibilidade
    public function index(Request $request)
    {
        $query = Product::query()->with(['images', 'variants', 'brand', 'category'])
            ->where('active', true);

        if ($request->filled('category')) {
            $query->whereHas('category', fn ($q) => $q->where('slug', $request->category));
        }
        if ($request->filled('gender')) {
            $query->where('gender', $request->gender);
        }
        if ($request->filled('brand_id')) {
            $query->where('brand_id', $request->brand_id);
        }
        if ($request->filled('min_price')) {
            $query->where('price', '>=', $request->min_price);
        }
        if ($request->filled('max_price')) {
            $query->where('price', '<=', $request->max_price);
        }
        if ($request->filled('color')) {
            $query->whereHas('variants', fn ($q) => $q->where('color', $request->color));
        }
        if ($request->filled('size')) {
            $query->whereHas('variants', fn ($q) => $q->where('size', $request->size));
        }
        if ($request->boolean('in_stock')) {
            $query->whereHas('variants', fn ($q) => $q->where('stock', '>', 0));
        }
        if ($request->filled('featured')) {
            $query->where('featured', true);
        }
        if ($request->filled('is_new')) {
            $query->where('is_new', true);
        }
        if ($request->filled('promo')) {
            $query->whereNotNull('promo_price');
        }
        if ($request->filled('search')) {
            $query->where('name', 'like', '%'.$request->search.'%');
        }

        $sort = $request->get('sort', 'recent');
        match ($sort) {
            'price_asc' => $query->orderBy('price'),
            'price_desc' => $query->orderByDesc('price'),
            'name' => $query->orderBy('name'),
            default => $query->latest(),
        };

        return response()->json($query->paginate($request->get('per_page', 20)));
    }

    public function show(string $slug)
    {
        $product = Product::with(['images', 'variants', 'reviews.user', 'category', 'brand'])
            ->where('slug', $slug)->where('active', true)->firstOrFail();

        $related = Product::where('category_id', $product->category_id)
            ->where('id', '!=', $product->id)->where('active', true)
            ->limit(8)->get();

        return response()->json(['product' => $product, 'related' => $related]);
    }

    // Calculo simples de frete por CEP (stub - substituir por integracao real
    // com Correios/transportadora)
    public function shipping(Request $request)
    {
        $request->validate(['zipcode' => 'required|string']);
        $zip = preg_replace('/\D/', '', $request->zipcode);

        if (strlen($zip) !== 8) {
            return response()->json(['message' => 'CEP invalido.'], 422);
        }

        return response()->json([
            'options' => [
                ['name' => 'PAC', 'price' => 19.90, 'days' => 7],
                ['name' => 'SEDEX', 'price' => 34.90, 'days' => 3],
            ],
        ]);
    }
}
