<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\NewsletterSubscriber;
use Illuminate\Http\Request;

class NewsletterController extends Controller
{
    public function store(Request $request)
    {
        $request->validate(['email' => 'required|email']);
        NewsletterSubscriber::firstOrCreate(['email' => $request->email]);

        return response()->json(['message' => 'Inscricao realizada com sucesso.']);
    }
}
