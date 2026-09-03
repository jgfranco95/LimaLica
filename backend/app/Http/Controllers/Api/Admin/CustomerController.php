<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;

class CustomerController extends Controller
{
    public function index(Request $request)
    {
        $query = User::where('role', 'customer')->withCount('orders')
            ->withSum('orders', 'total');

        if ($request->filled('search')) {
            $query->where('name', 'like', '%'.$request->search.'%')
                ->orWhere('email', 'like', '%'.$request->search.'%');
        }

        return response()->json($query->latest()->paginate(20));
    }

    public function show(int $id)
    {
        $customer = User::where('role', 'customer')
            ->with(['addresses', 'orders.items'])
            ->findOrFail($id);

        return response()->json($customer);
    }
}
