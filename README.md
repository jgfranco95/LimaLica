# Lima Lica — E-commerce

Este projeto contém a estrutura completa (backend Laravel + frontend React)
para o e-commerce Lima Lica, conforme a especificação enviada.

## ⚠️ Leia antes de rodar

Este é um **scaffold funcional e completo em estrutura**, cobrindo:

- Banco de dados completo (migrations): usuários, endereços, categorias,
  marcas, produtos, variações (cor/tamanho), imagens, estoque com
  histórico de movimentações, avaliações, favoritos, cupons, pedidos,
  itens de pedido, banners, newsletter, logs de acesso.
- Autenticação de cliente e admin (Laravel Sanctum), com painel admin
  protegido por middleware separado.
- Loja pública: Home, categorias com filtros, página de produto (galeria,
  zoom, variações, cálculo de frete), carrinho, checkout com cupom,
  área do cliente (dados, endereços, pedidos, favoritos).
- Checkout com integração real ao **Mercado Pago** (Pix com QR Code +
  cartão), webhook que confirma pagamento e só então baixa o estoque
  automaticamente (evitando prender estoque em pedidos não pagos).
- Painel admin: dashboard com indicadores, CRUD de produtos, controle de
  estoque (entrada/saída/ajuste com histórico), categorias, cupons,
  pedidos (com atualização de status e código de rastreio), clientes,
  banners, newsletter (com exportação CSV).

**O que você precisa fazer para rodar de verdade:**

1. Ter PHP 8.2+, Composer, MySQL e Node.js instalados na sua máquina
   (não incluídos aqui — este ambiente de chat não roda Laravel/MySQL).
2. Rodar `composer install` dentro de `backend/` para baixar o Laravel e
   as dependências (o `composer.json` já lista tudo, incluindo o SDK do
   Mercado Pago).
3. Gerar os models de `Product`, `Category` etc. que criei já cobrem o
   essencial; para produção, revise regras de validação e permissões
   (`policies`) conforme a necessidade real do negócio.
4. Algumas partes foram deixadas como **stub/TODO propositalmente**,
   porque dependem de decisões de negócio ou de credenciais reais:
   - Cálculo de frete: hoje retorna valores fixos de exemplo; troque por
     integração real com Correios/transportadora.
   - E-mails transacionais (confirmação de pedido, recuperação de senha):
     os pontos de disparo estão comentados no código (`CheckoutController`,
     `AuthController`), faltando criar as `Notification`/`Mailable`.
   - Formulário completo de cadastro de produto no admin (upload múltiplo
     de imagens + variações dinâmicas) está com a base pronta em
     `ProductsAdmin.jsx`, mas o formulário de criação em si é simples;
     a API (`Admin/ProductController@store`) já aceita tudo que a spec pede.
   - Rate limiting, logs de acesso e backup automático do banco: o Laravel
     já traz rate limiting por padrão nas rotas de API; logs de acesso têm
     a tabela pronta (`access_logs`) mas o middleware que grava nela ainda
     não foi criado; backup pode ser feito com o pacote
     `spatie/laravel-backup` (não incluído no composer.json).

## Como rodar (passo a passo)

### Backend

```bash
cd backend
cp .env.example .env
composer install
php artisan key:generate
# configure DB_* no .env com seu MySQL
php artisan migrate
php artisan db:seed --class=Database\\Seeders\\AdminUserSeeder
php artisan storage:link
php artisan serve
```

Login do admin criado pelo seeder: `admin@limalica.com.br` / `TrocarEssaSenha123!`
(troque essa senha imediatamente).

No `.env`, preencha `MERCADOPAGO_ACCESS_TOKEN` e `MERCADOPAGO_PUBLIC_KEY`
com as credenciais da sua conta Mercado Pago (developers.mercadopago.com.br).
Adicione também o bloco de `config/services_mercadopago_snippet.php` dentro
do seu `config/services.php`.

### Frontend

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

Acesse `http://localhost:5173` para a loja e `http://localhost:5173/admin/login`
para o painel administrativo.

## Estrutura de pastas

```
lima-lica/
├── backend/                 # API Laravel
│   ├── app/Models/          # Eloquent models
│   ├── app/Http/Controllers/Api/        # Controllers da loja
│   ├── app/Http/Controllers/Api/Admin/  # Controllers do painel admin
│   ├── app/Services/MercadoPagoService.php
│   ├── database/migrations/
│   ├── database/seeders/
│   └── routes/api.php
└── frontend/                 # React + Tailwind
    └── src/
        ├── pages/             # Home, Categoria, Produto, Carrinho, Checkout...
        ├── pages/admin/        # Dashboard, Produtos, Estoque, Pedidos...
        ├── components/
        ├── context/            # AuthContext, CartContext
        └── services/api.js
```

## Próximos passos sugeridos

1. Rodar localmente e ajustar credenciais.
2. Popular o banco com produtos reais (via seeder ou pelo admin).
3. Testar o fluxo de checkout em modo sandbox do Mercado Pago.
4. Revisar políticas de autorização (`policies`) por perfil de admin, se
   houver mais de um nível de permissão.
5. Adicionar testes automatizados (PHPUnit no backend, Vitest no frontend).
