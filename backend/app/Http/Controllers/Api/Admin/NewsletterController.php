<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\NewsletterSubscriber;
use Illuminate\Http\Response;
use Symfony\Component\HttpFoundation\StreamedResponse;

class NewsletterController extends Controller
{
    public function index()
    {
        return response()->json(NewsletterSubscriber::latest()->paginate(50));
    }

    // Exportacao em CSV
    public function export(): StreamedResponse
    {
        $subscribers = NewsletterSubscriber::all();

        return response()->streamDownload(function () use ($subscribers) {
            $handle = fopen('php://output', 'w');
            fputcsv($handle, ['email', 'cadastrado_em']);
            foreach ($subscribers as $s) {
                fputcsv($handle, [$s->email, $s->created_at->format('d/m/Y H:i')]);
            }
            fclose($handle);
        }, 'newsletter.csv');
    }
}
