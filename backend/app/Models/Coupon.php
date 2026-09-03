<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Carbon;

class Coupon extends Model
{
    protected $fillable = [
        'code', 'type', 'value', 'min_purchase_value', 'max_uses',
        'used_count', 'valid_from', 'valid_until', 'active',
    ];

    public function isValid(float $cartTotal): bool
    {
        if (! $this->active) {
            return false;
        }
        $now = Carbon::now();
        if ($this->valid_from && $now->lt($this->valid_from)) {
            return false;
        }
        if ($this->valid_until && $now->gt($this->valid_until)) {
            return false;
        }
        if ($this->max_uses && $this->used_count >= $this->max_uses) {
            return false;
        }
        if ($cartTotal < $this->min_purchase_value) {
            return false;
        }

        return true;
    }

    public function calculateDiscount(float $subtotal): float
    {
        return match ($this->type) {
            'percentual' => round($subtotal * ($this->value / 100), 2),
            'valor_fixo' => min($this->value, $subtotal),
            'frete_gratis' => 0, // frete zerado é tratado separadamente no checkout
            default => 0,
        };
    }
}
