<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

/**
 * Garante que apenas usuarios com role=admin acessem as rotas do painel.
 * Login de cliente e de admin usam o mesmo endpoint /login, mas essa
 * middleware bloqueia clientes que tentem acessar rotas /api/admin/*.
 */
class EnsureUserIsAdmin
{
    public function handle(Request $request, Closure $next)
    {
        if (! $request->user() || ! $request->user()->isAdmin()) {
            return response()->json(['message' => 'Acesso restrito a administradores.'], 403);
        }

        return $next($request);
    }
}
