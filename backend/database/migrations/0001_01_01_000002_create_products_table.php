<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('brands', function (Blueprint $table) {
            $table->id();
            $table->string('name')->unique();
            $table->timestamps();
        });

        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique();
            $table->string('sku')->unique();
            $table->string('internal_code')->nullable();
            $table->foreignId('category_id')->constrained();
            $table->foreignId('brand_id')->nullable()->constrained();
            $table->text('short_description')->nullable();
            $table->longText('description')->nullable();
            $table->decimal('cost_price', 10, 2)->nullable();
            $table->decimal('price', 10, 2);
            $table->decimal('promo_price', 10, 2)->nullable();
            $table->date('promo_start_at')->nullable();
            $table->date('promo_end_at')->nullable();
            $table->decimal('weight_kg', 8, 3)->nullable();
            $table->decimal('height_cm', 8, 2)->nullable();
            $table->decimal('width_cm', 8, 2)->nullable();
            $table->decimal('length_cm', 8, 2)->nullable();
            $table->enum('gender', ['feminino', 'masculino', 'infantil', 'unissex'])->default('unissex');
            $table->string('video_url')->nullable();
            $table->boolean('active')->default(true);
            $table->boolean('featured')->default(false);
            $table->boolean('is_new')->default(false);
            $table->unsignedInteger('installments_max')->default(1);
            $table->timestamps();
        });

        Schema::create('product_images', function (Blueprint $table) {
            $table->id();
            $table->foreignId('product_id')->constrained()->cascadeOnDelete();
            $table->string('path');
            $table->unsignedInteger('sort_order')->default(0);
            $table->timestamps();
        });

        // Variacoes: cor x tamanho, cada uma com seu proprio estoque
        Schema::create('product_variants', function (Blueprint $table) {
            $table->id();
            $table->foreignId('product_id')->constrained()->cascadeOnDelete();
            $table->string('color')->nullable();
            $table->string('size')->nullable();
            $table->string('variant_sku')->unique();
            $table->unsignedInteger('stock')->default(0);
            $table->timestamps();
        });

        Schema::create('stock_movements', function (Blueprint $table) {
            $table->id();
            $table->foreignId('product_variant_id')->constrained()->cascadeOnDelete();
            $table->enum('type', ['entrada', 'saida', 'ajuste', 'venda']);
            $table->integer('quantity'); // positivo ou negativo
            $table->string('reason')->nullable();
            $table->foreignId('user_id')->nullable()->constrained();
            $table->timestamps();
        });

        Schema::create('reviews', function (Blueprint $table) {
            $table->id();
            $table->foreignId('product_id')->constrained()->cascadeOnDelete();
            $table->foreignId('user_id')->constrained();
            $table->unsignedTinyInteger('rating');
            $table->text('comment')->nullable();
            $table->timestamps();
        });

        Schema::create('favorites', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('product_id')->constrained()->cascadeOnDelete();
            $table->timestamps();
            $table->unique(['user_id', 'product_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('favorites');
        Schema::dropIfExists('reviews');
        Schema::dropIfExists('stock_movements');
        Schema::dropIfExists('product_variants');
        Schema::dropIfExists('product_images');
        Schema::dropIfExists('products');
        Schema::dropIfExists('brands');
    }
};
