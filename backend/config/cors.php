<?php

// Este arquivo não existe por padrão no Laravel 11 (ele usa um valor
// interno "*" pra allowed_origins). Estamos publicando ele aqui só
// pra travar o CORS no domínio real da loja em produção, em vez de
// aceitar requisição de qualquer origem.

return [
    'paths' => ['api/*', 'sanctum/csrf-cookie'],

    'allowed_methods' => ['*'],

    // Em produção, defina CORS_ALLOWED_ORIGINS no .env com o domínio
    // real da loja (ex: https://limalica.com.br). Aceita múltiplos
    // domínios separados por vírgula, útil se tiver staging + produção.
    'allowed_origins' => array_filter(
        array_map('trim', explode(',', env('CORS_ALLOWED_ORIGINS', env('FRONTEND_URL', '*'))))
    ),

    'allowed_origins_patterns' => [],

    'allowed_headers' => ['*'],

    'exposed_headers' => [],

    'max_age' => 0,

    'supports_credentials' => false,
];