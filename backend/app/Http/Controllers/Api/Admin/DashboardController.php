<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\ProductVariant;
use App\Models\User;
use Illuminate\Support\Carbon;

class DashboardController extends Controller
{
    public function index()
    {
        $today = Carbon::today();

        $paidOrders = Order::whereIn('status', ['pago', 'separacao', 'enviado', 'entregue']);

        return response()->json([
            'total_sales' => (clone $paidOrders)->count(),
            'orders_today' => Order::whereDate('created_at', $today)->count(),
            'revenue' => (clone $paidOrders)->sum('total'),
            'revenue_today' => (clone $paidOrders)->whereDate('created_at', $today)->sum('total'),
            'products_sold' => OrderItem::whereHas('order', fn ($q) => $q->whereIn('status', ['pago', 'separacao', 'enviado', 'entregue']))->sum('quantity'),
            'out_of_stock_products' => Product::whereDoesntHave('variants', fn ($q) => $q->where('stock', '>', 0))->count(),
            'best_sellers' => OrderItem::selectRaw('product_name, SUM(quantity) as total_qty')
                ->groupBy('product_name')->orderByDesc('total_qty')->limit(5)->get(),
            'registered_customers' => User::where('role', 'customer')->count(),
        ]);
    }
}
