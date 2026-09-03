<?php

use App\Http\Controllers\Api\Admin\BannerController as AdminBannerController;
use App\Http\Controllers\Api\Admin\CategoryController as AdminCategoryController;
use App\Http\Controllers\Api\Admin\CouponController as AdminCouponController;
use App\Http\Controllers\Api\Admin\CustomerController;
use App\Http\Controllers\Api\Admin\DashboardController;
use App\Http\Controllers\Api\Admin\NewsletterController as AdminNewsletterController;
use App\Http\Controllers\Api\Admin\OrderController as AdminOrderController;
use App\Http\Controllers\Api\Admin\ProductController as AdminProductController;
use App\Http\Controllers\Api\Admin\StockController;
use App\Http\Controllers\Api\AddressController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\BannerController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\CheckoutController;
use App\Http\Controllers\Api\CouponController;
use App\Http\Controllers\Api\FavoriteController;
use App\Http\Controllers\Api\NewsletterController;
use App\Http\Controllers\Api\OrderController;
use App\Http\Controllers\Api\ProductController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Rotas publicas (loja)
|--------------------------------------------------------------------------
*/
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/forgot-password', [AuthController::class, 'forgotPassword']);

Route::get('/products', [ProductController::class, 'index']);
Route::get('/products/{slug}', [ProductController::class, 'show']);
Route::post('/shipping/calculate', [ProductController::class, 'shipping']);
Route::get('/categories', [CategoryController::class, 'index']);
Route::get('/banners', [BannerController::class, 'index']);
Route::post('/newsletter', [NewsletterController::class, 'store']);
Route::post('/coupons/validate', [CouponController::class, 'validateCoupon']);

// Webhook do Mercado Pago (sem autenticacao - validado via assinatura/secret)
Route::post('/webhooks/mercadopago', [CheckoutController::class, 'webhook']);

/*
|--------------------------------------------------------------------------
| Rotas autenticadas - Cliente (Sanctum)
|--------------------------------------------------------------------------
*/
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);
    Route::put('/me', [AuthController::class, 'updateProfile']);
    Route::put('/me/password', [AuthController::class, 'updatePassword']);

    Route::apiResource('addresses', AddressController::class)->except(['show']);

    Route::get('/favorites', [FavoriteController::class, 'index']);
    Route::post('/favorites/{product}', [FavoriteController::class, 'toggle']);

    Route::post('/checkout', [CheckoutController::class, 'store']);
    Route::get('/orders', [OrderController::class, 'index']);
    Route::get('/orders/{id}', [OrderController::class, 'show']);

    /*
    |----------------------------------------------------------------------
    | Painel Administrativo - protegido por auth:sanctum + admin
    | Login separado do cliente (mesma rota /login, role diferente)
    |----------------------------------------------------------------------
    */
    Route::prefix('admin')->middleware('admin')->group(function () {
        Route::get('/dashboard', [DashboardController::class, 'index']);

        Route::apiResource('products', AdminProductController::class);
        Route::apiResource('categories', AdminCategoryController::class)->except(['show']);
        Route::post('/categories/reorder', [AdminCategoryController::class, 'reorder']);

        Route::get('/stock', [StockController::class, 'index']);
        Route::post('/stock', [StockController::class, 'store']);

        Route::apiResource('coupons', AdminCouponController::class)->except(['show']);
        Route::apiResource('banners', AdminBannerController::class)->except(['show']);

        Route::get('/orders', [AdminOrderController::class, 'index']);
        Route::get('/orders/{id}', [AdminOrderController::class, 'show']);
        Route::put('/orders/{id}', [AdminOrderController::class, 'update']);

        Route::get('/customers', [CustomerController::class, 'index']);
        Route::get('/customers/{id}', [CustomerController::class, 'show']);

        Route::get('/newsletter', [AdminNewsletterController::class, 'index']);
        Route::get('/newsletter/export', [AdminNewsletterController::class, 'export']);
    });
});
