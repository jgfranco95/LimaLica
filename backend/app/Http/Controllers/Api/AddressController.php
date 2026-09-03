<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Address;
use Illuminate\Http\Request;

class AddressController extends Controller
{
    public function index(Request $request)
    {
        return response()->json($request->user()->addresses);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'label' => 'nullable|string',
            'zipcode' => 'required|string',
            'street' => 'required|string',
            'number' => 'required|string',
            'complement' => 'nullable|string',
            'neighborhood' => 'required|string',
            'city' => 'required|string',
            'state' => 'required|string|size:2',
            'is_default' => 'boolean',
        ]);

        if ($request->boolean('is_default')) {
            $request->user()->addresses()->update(['is_default' => false]);
        }

        $address = $request->user()->addresses()->create($data);

        return response()->json($address, 201);
    }

    public function update(Request $request, int $id)
    {
        $address = $request->user()->addresses()->findOrFail($id);
        $address->update($request->all());

        return response()->json($address);
    }

    public function destroy(Request $request, int $id)
    {
        $request->user()->addresses()->findOrFail($id)->delete();

        return response()->json(['message' => 'Endereco removido.']);
    }
}
