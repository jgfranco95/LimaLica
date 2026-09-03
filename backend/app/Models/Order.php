<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    protected $fillable = [
        'order_number', 'user_id', 'address_id', 'coupon_id', 'subtotal',
        'discount', 'shipping_cost', 'total', 'payment_method', 'status',
        'tracking_code', 'mp_payment_id', 'mp_preference_id',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function address()
    {
        return $this->belongsTo(Address::class);
    }

    public function items()
    {
        return $this->hasMany(OrderItem::class);
    }
}
