#!/usr/bin/env bash
echo "Instalando dependências do PHP..."
composer install --no-dev --optimize-autoloader --working-dir=/var/www/html

echo "Cacheando configuração..."
php artisan config:cache

echo "Cacheando rotas..."
php artisan route:cache

echo "Rodando migrations no banco (Supabase)..."
php artisan migrate --force