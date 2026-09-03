<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\ProductImage;
use App\Models\ProductVariant;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class ProductController extends Controller
{
    public function index(Request $request)
    {
        $query = Product::with(['category', 'brand', 'variants']);

        if ($request->filled('search')) {
            $query->where('name', 'like', '%'.$request->search.'%')
                ->orWhere('sku', 'like', '%'.$request->search.'%');
        }

        return response()->json($query->latest()->paginate(20));
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'sku' => 'required|string|unique:products,sku',
            'internal_code' => 'nullable|string',
            'category_id' => 'required|exists:categories,id',
            'brand_id' => 'nullable|exists:brands,id',
            'short_description' => 'nullable|string',
            'description' => 'nullable|string',
            'cost_price' => 'nullable|numeric',
            'price' => 'required|numeric',
            'promo_price' => 'nullable|numeric',
            'promo_start_at' => 'nullable|date',
            'promo_end_at' => 'nullable|date',
            'weight_kg' => 'nullable|numeric',
            'height_cm' => 'nullable|numeric',
            'width_cm' => 'nullable|numeric',
            'length_cm' => 'nullable|numeric',
            'gender' => 'required|in:feminino,masculino,infantil,unissex',
            'video_url' => 'nullable|url',
            'active' => 'boolean',
            'featured' => 'boolean',
            'is_new' => 'boolean',
            'images' => 'nullable|array',
            'images.*' => 'image|max:4096',
            'variants' => 'required|array|min:1',
            'variants.*.color' => 'nullable|string',
            'variants.*.size' => 'nullable|string',
            'variants.*.stock' => 'required|integer|min:0',
        ]);

        $data['slug'] = Str::slug($data['name']).'-'.Str::random(5);

        $product = Product::create($data);

        foreach ($request->file('images', []) as $index => $file) {
            $path = $file->store('products', 'public');
            ProductImage::create(['product_id' => $product->id, 'path' => $path, 'sort_order' => $index]);
        }

        foreach ($data['variants'] as $variant) {
            ProductVariant::create([
                'product_id' => $product->id,
                'color' => $variant['color'] ?? null,
                'size' => $variant['size'] ?? null,
                'variant_sku' => $data['sku'].'-'.Str::upper(Str::random(4)),
                'stock' => $variant['stock'],
            ]);
        }

        return response()->json($product->load('images', 'variants'), 201);
    }

    public function update(Request $request, int $id)
    {
        $product = Product::findOrFail($id);
        $product->update($request->except(['images', 'variants']));

        return response()->json($product);
    }

    public function destroy(int $id)
    {
        Product::findOrFail($id)->delete();

        return response()->json(['message' => 'Produto removido.']);
    }
}
