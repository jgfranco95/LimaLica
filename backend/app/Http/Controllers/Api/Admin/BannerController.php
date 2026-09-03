<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Banner;
use Illuminate\Http\Request;

class BannerController extends Controller
{
    public function index()
    {
        return response()->json(Banner::orderBy('sort_order')->get());
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'image' => 'required|image|max:4096',
            'title' => 'nullable|string',
            'subtitle' => 'nullable|string',
            'link' => 'nullable|string',
            'start_at' => 'nullable|date',
            'end_at' => 'nullable|date',
            'sort_order' => 'nullable|integer',
        ]);

        $path = $request->file('image')->store('banners', 'public');

        $banner = Banner::create([
            'image_path' => $path,
            'title' => $data['title'] ?? null,
            'subtitle' => $data['subtitle'] ?? null,
            'link' => $data['link'] ?? null,
            'start_at' => $data['start_at'] ?? null,
            'end_at' => $data['end_at'] ?? null,
            'sort_order' => $data['sort_order'] ?? 0,
        ]);

        return response()->json($banner, 201);
    }

    public function update(Request $request, int $id)
    {
        $banner = Banner::findOrFail($id);
        $banner->update($request->except('image'));

        return response()->json($banner);
    }

    public function destroy(int $id)
    {
        Banner::findOrFail($id)->delete();

        return response()->json(['message' => 'Banner removido.']);
    }
}
