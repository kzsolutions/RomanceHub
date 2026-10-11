# RomanceHub

Plataforma de leitura de romances em português. Biblioteca pública, leitor com capítulos gratuitos e premium, biblioteca pessoal, favoritos, notificações, painel de administração e **monetização por pagamentos manuais (e-Mola / M-Pesa)** — sem gateway, com verificação e aprovação por um administrador.

## Stack

- **Next.js 15** (App Router, Turbopack) + **React 19**
- **TypeScript** + **Tailwind CSS v4**
- **Supabase** (Postgres, Auth, Storage, RLS)
- Ícones `lucide-react`, gráficos `recharts`, validação `zod`

## Requisitos

- Node.js 20+ (testado em Node 24)
- Um projeto Supabase (URL + publishable key)
- PowerShell / terminal — em Windows usa `npm.cmd` se a política de execução bloquear `npm.ps1`

## Configuração

1. Instala dependências:

   ```bash
   npm install
   ```

2. Cria o `.env.local` a partir do `.env.example`:

   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://SEU-PROJETO.supabase.co
   NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_...
   NEXT_PUBLIC_SITE_URL=http://localhost:3000
   ```

   Usa apenas a **publishable (anon) key**. Nenhum `service_role` é necessário nem deve entrar no frontend.

3. Cria/atualiza o esquema da base de dados (ver abaixo).

4. Arranca:

   ```bash
   npm run dev      # desenvolvimento (Turbopack)
   npm run build    # build de produção
   npm run start    # servir a build
   npm run lint     # ESLint
   ```

## Base de dados

O esquema base (`profiles`, `stories`, `chapters`, `chapter_contents`, `categories`, `tags`, `favorites`, `ratings`, `reading_progress`, `comments`, `notifications`, `reports`, `banners`, `settings`, `purchases` + enums e políticas RLS) **já deve existir** no projeto Supabase.

Sobre esse esquema aplicam-se, por ordem, as migrações da monetização em `supabase/migrations/`:

| Ficheiro | Conteúdo |
| --- | --- |
| `0001_payments_schema.sql` | Colunas de `purchases`, `price_cents` em `stories`/`chapters`, índices anti-duplicação e tabela `payment_audit`. |
| `0002_payments_rls.sql` | Políticas RLS de `purchases`/`payment_audit`. |
| `0003_payments_rpc.sql` | Funções `create_payment_order`, `submit_payment_proof`, `approve_payment_order`, `reject_payment_order`, `update_payment_instructions`, `has_access`. |
| `0004_payments_config_storage.sql` | `settings` (`payment.instructions`) e bucket privado `payment-proofs` + políticas de storage. |
| `0005_fix_create_payment_order.sql` | Corrige ambiguidade de `id` em `create_payment_order`. |

Aplica-as no **SQL Editor** do Supabase (são idempotentes). Não é necessária a `service_role`.

> As migrações assumem o esquema base. Se estiveres a montar de raiz, aplica primeiro o esquema base/seed e só depois `0001`→`0005`.

## Contas de demonstração

Password universal (seed): **`RomanceHub2026`**

| Perfil | Email |
| --- | --- |
| Administrador | `admin@romancehub.app` |
| Leitor | `leitor@romancehub.app` |
| Leitores extra | `leitor01@romancehub.app`, `leitor02@romancehub.app`, … |

O administrador é o único perfil com `profiles.role = 'admin'`.

## Rotas principais

**Público:** `/` · `/explorar` · `/categorias` · `/categorias/[slug]` · `/historias/[slug]` · `/pesquisa` · `/entrar` · `/criar-conta`

**Leitor (autenticado):** `/ler/[slug]/[numero]` · `/biblioteca` · `/favoritos` · `/notificacoes` · `/perfil` · `/compras` · `/comprar/[slug]` · `/comprar/[slug]/[numero]` · `/pagamento/[id]`

**Administração:** `/admin` · `/admin/historias` (+ `nova`, `[id]`) · `/admin/capitulos/[id]` · `/admin/pagamentos` (+ `[id]`) · `/admin/categorias` · `/admin/tags` · `/admin/comentarios` · `/admin/reports` · `/admin/utilizadores` · `/admin/autores` · `/admin/banners` · `/admin/definicoes`

## Fluxo de pagamentos (manual)

1. O autor define o **preço** da obra e/ou do capítulo em meticais (MT) no painel admin. Sem preço (`price_cents = NULL`) o item não é vendável.
2. O leitor abre **Comprar** num capítulo/obra, cria um **pedido** com referência única (`RH-XXXXXXXX`) e vê os dados de pagamento configurados.
3. Transfere por e-Mola/M-Pesa e submete a **referência da transferência** e, opcionalmente, um **comprovativo** (bucket privado `payment-proofs`).
4. O pedido fica `pending`. O administrador confirma na página **Pagamentos** e **aprova** ou **rejeita** (com motivo).
5. Só após a aprovação é concedido o acesso (`has_access`). Um pedido rejeitado fica `failed` com `rejection_reason`. Todas as decisões ficam registadas em `payment_audit`.

O preço é **sempre validado no servidor**; nunca se confia no valor enviado pelo cliente.

Estados de `purchases.status`: `pending`, `completed`, `failed` (usado como rejeitado), `refunded`.

## Configuração obrigatória antes de vender

Em **Admin → Definições** (`/admin/definicoes`):

- Dados de pagamento **e-Mola** e **M-Pesa** (número, titular, ativo/inativo) — já em `settings.payment.instructions`.
- Texto de **instruções** e **orientações ao leitor** (passos a mostrar a quem compra).

E, por item, definir os **preços reais** em MT.

## Segurança

- Apenas a publishable key é usada; `service_role` nunca sai do servidor.
- Toda a autorização assenta em **RLS** + funções `security definer`: um leitor só vê as suas compras, não consegue alterar preços nem forçar estados, e só um admin aprova/rejeita.
- Conteúdo premium não é legível sem entitlement, inclusive por acesso direto à API REST.
- `/compras`, `/comprar/*` e `/pagamento/*` estão atrás de autenticação (middleware).
- O bucket `payment-proofs` é privado e por utilizador.

## Notas de desenvolvimento

- `npm run start` requer uma build recente (`npm run build`). Se alternaste entre `dev` e produção, remove `.next` antes de rebuildar.
- Testes de integração locais (smokes público/leitor/biblioteca/admin e e2e de pagamentos) correm contra `http://localhost:3000` com sessões reais via server actions.
