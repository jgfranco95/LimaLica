<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Carbon;

class Product extends Model
{
    protected $fillable = [
        'name', 'slug', 'sku', 'internal_code', 'category_id', 'brand_id',
        'short_description', 'description', 'cost_price', 'price', 'promo_price',
        'promo_start_at', 'promo_end_at', 'weight_kg', 'height_cm', 'width_cm',
        'length_cm', 'gender', 'video_url', 'active', 'featured', 'is_new',
        'installments_max',
    ];

    protected function casts(): array
    {
        return [
            'promo_start_at' => 'date',
            'promo_end_at' => 'date',
            'active' => 'boolean',
            'featured' => 'boolean',
            'is_new' => 'boolean',
        ];
    }

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function brand()
    {
        return $this->belongsTo(Brand::class);
    }

    public function images()
    {
        return $this->hasMany(ProductImage::class)->orderBy('sort_order');
    }

    public function variants()
    {
        return $this->hasMany(ProductVariant::class);
    }

    public function reviews()
    {
        return $this->hasMany(Review::class);
    }

    // Verifica se a promocao esta ativa na data atual
    public function isPromoActive(): bool
    {
        if (! $this->promo_price) {
            return false;
        }
        $today = Carbon::today();
        $afterStart = ! $this->promo_start_at || $today->gte($this->promo_start_at);
        $beforeEnd = ! $this->promo_end_at || $today->lte($this->promo_end_at);

        return $afterStart && $beforeEnd;
    }

    public function currentPrice(): float
    {
        return $this->isPromoActive() ? (float) $this->promo_price : (float) $this->price;
    }

    public function discountPercent(): int
    {
        if (! $this->isPromoActive()) {
            return 0;
        }

        return (int) round((1 - ($this->promo_price / $this->price)) * 100);
    }

    public function totalStock(): int
    {
        return $this->variants()->sum('stock');
    }
}
