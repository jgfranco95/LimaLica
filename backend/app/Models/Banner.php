<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Banner extends Model
{
    protected $fillable = [
        'image_path', 'title', 'subtitle', 'link', 'start_at', 'end_at',
        'sort_order', 'active',
    ];
}
