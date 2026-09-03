<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Banner;
use Illuminate\Support\Carbon;

class BannerController extends Controller
{
    public function index()
    {
        $today = Carbon::today();

        $banners = Banner::where('active', true)
            ->where(fn ($q) => $q->whereNull('start_at')->orWhere('start_at', '<=', $today))
            ->where(fn ($q) => $q->whereNull('end_at')->orWhere('end_at', '>=', $today))
            ->orderBy('sort_order')->get();

        return response()->json($banners);
    }
}
