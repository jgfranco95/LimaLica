<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class CategoryController extends Controller
{
    public function index()
    {
        return response()->json(Category::orderBy('sort_order')->get());
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string',
            'description' => 'nullable|string',
            'sort_order' => 'nullable|integer',
        ]);
        $data['slug'] = Str::slug($data['name']);

        return response()->json(Category::create($data), 201);
    }

    public function update(Request $request, int $id)
    {
        $category = Category::findOrFail($id);
        $category->update($request->all());

        return response()->json($category);
    }

    public function destroy(int $id)
    {
        Category::findOrFail($id)->delete();

        return response()->json(['message' => 'Categoria removida.']);
    }

    // Reordenacao via drag-and-drop no admin: recebe [{id, sort_order}, ...]
    public function reorder(Request $request)
    {
        foreach ($request->input('items', []) as $item) {
            Category::where('id', $item['id'])->update(['sort_order' => $item['sort_order']]);
        }

        return response()->json(['message' => 'Ordem atualizada.']);
    }
}
