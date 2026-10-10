#!/usr/bin/env bash
cd /var/www/html

echo "Criando pastas de cache e logs do Laravel..."
mkdir -p storage/framework/cache/data storage/framework/sessions storage/framework/views storage/logs bootstrap/cache

echo "Instalando dependências do PHP..."
composer install --no-dev --optimize-autoloader --working-dir=/var/www/html

echo "Limpando caches antigos..."
php artisan config:clear
php artisan route:clear

echo "Cacheando configuração e rotas..."
php artisan config:cache
php artisan route:cache

echo "Rodando migrations no banco (Supabase)..."
php artisan migrate --force

echo "Garantindo que existe um usuário admin..."
php artisan db:seed --class='Database\Seeders\AdminUserSeeder' --force

echo "Ajustando permissões..."
chown -R nginx:nginx storage bootstrap/cache 2>/dev/null || true
chmod -R 775 storage bootstrap/cache
