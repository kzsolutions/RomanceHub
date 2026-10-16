# Plano 0007 — Velocidade de navegação + Paywall por história

## Decisões do utilizador (2026-10-14)
1. **Paywall**: reutilizar o sistema existente (`purchases` kind=`story`), sem tabela `compras_historias` nova.
2. **Prévia**: capítulos iniciais grátis **configuráveis por história**, mínimo 3 (padrão 50% dos capítulos publicados).
3. **Geração IA (+16)**: adiada — só velocidade primeiro.
4. **Região Vercel**: manter `iad1`; rever depois de cortar chamadas.

---

## Diagnóstico (medições reais, 2026-10-14)

**Produção (Vercel + Supabase remoto):**
- TTFB: `/` 1,2–5,2 s · `/explorar` ~2,9 s · `/historias/[slug]` ~1–2 s · `/ler/[slug]/N` ~1,5–2,2 s · `/comprar` ~1,9 s
- Região: funções Vercel em `iad1` (`x-vercel-id: cpt1::iad1`), edge CDN cpt1 (Cape Town)
- Supabase REST: 300–1300 ms/call mesmo para endpoints que não tocam a BD (overhead de rede/gateway, **não** lentidão SQL — query pesada ≈ query leve no banco pequeno)

**Contagem de chamadas Supabase por página (código fonte):**
| Página | Chamadas | Fases sequenciais |
|---|---|---|
| `/historias/[slug]` | ~13 | ~8 |
| `/ler/[slug]/N` | ~11 | ~7 |
| `/explorar` | ~6 | ~3 |
| `/` (anon) | ~9 | ~1 (bom) |
| +3 por sessão autenticada | middleware `getUser` + layout (getUser+profiles+notifications) | +3 |

**Causas-raiz (4):**
1. `auth.getUser()` repetido 22× no repo; layout faz 3 chamadas sequenciais por request; `getStorySocialState` chamada sequencialmente.
2. Funções Vercel em US East (~150–200 ms/ida × 10 chamadas).
3. **Zero `loading.tsx`** → navegação client-side = ecrã branco até render completo (maior contribuinte para os 30–45 s percebidos).
4. Tudo `dynamic` (cookies), sem cache; contagens `count: "exact"`.

**Não são problema:** capas (SVG 2 KB), fontes (self-hosted), imagens externas (nenhuma), banco pequeno (7 histórias, 42 capítulos).

---

## FASE 1 — Velocidade (sem tocar em pagamentos)

### 1.1 Consolidar autenticação (−4 a −5 chamadas/página autenticada)
- **Ficheiro-chave**: `src/lib/supabase/server.ts` → criar `getAuthContext()` com React `cache()`: 1× `auth.getUser()` + 1× perfil por request, partilhado por layout + páginas.
- **`src/middleware.ts`**: só chamar `auth.getUser()` se existir cookie de sessão (`sb-…-auth-token`); sem cookie → passa direto (zero rede em anónimos). Manter security headers e matcher atuais.
- Substituir todas as chamadas diretas `.auth.getUser()` em `src/lib/data/*.ts` e `src/lib/actions/*.ts` pelo `getAuthContext()` (ou `getCurrentUser()` cacheado).
- Layout `(site)/layout.tsx`: usar `getAuthContext()`; contador de notificações fica na mesma request.

### 1.2 Paralelizar e enxugar queries
- `getStoryBySlug` (`stories.ts`): lançar em paralelo o que não depende (story + chapters + social state).
- `getStorySocialState` (`library.ts`): receber o userId/context já resolvido (evita novo `getUser()`).
- `getReaderChapter` (`reader.ts`): `Promise.all` entre story/meta e chapter/contents; userId via contexto.
- `listStories`/`getHomeData`: `count: "estimated"` em listagens (guardar `exact` só onde a UI mostra o total exato, ex. admin).
- Evitar duplo cliente: funções internas (ex. `getHomeData` → `listStories`) reutilizam o mesmo `createClient()`.

### 1.3 Cache de conteúdo público
- `unstable_cache` com TTL curto (60–300 s) para: categorias, `getHomeData` (feeds públicos), `getStoryBySlug` (dados públicos: título, sinopse, capas, capítulos publicados).
- **Nunca** cachear: conteúdo de capítulos pagos, dados de utilizador, decisões de acesso (RLS continua a ser a autoridade).
- Tag-based revalidação nos mutations do admin (`revalidatePath`/`revalidateTag` já após `createStory`, etc.).

### 1.4 Skeletons de navegação (maior ganho percebido)
Criar `loading.tsx` (Server) com skeletons:
- `src/app/(site)/loading.tsx` (home)
- `src/app/(site)/explorar/loading.tsx`
- `src/app/(site)/historias/[slug]/loading.tsx`
- `src/app/(site)/ler/[slug]/[numero]/loading.tsx`
- `src/app/(site)/categorias/loading.tsx`
- `src/app/(site)/pesquisa/loading.tsx`
- `src/app/(site)/biblioteca/loading.tsx`

### 1.5 Medição antes/depois
- Script de medição (TTFB por página × 3, produção e local) + contagem de chamadas Supabase por página.
- Critério de sucesso: TTFB `/explorar` e `/historias/[slug]` < 1 s local, e redução de ≥40% em chamadas Supabase/página autenticada.

---

## FASE 2 — Paywall por história (reutilizando `purchases`)

### 2.1 Schema (migração `0007`)
- `stories.preview_chapter_limit int null` — capítulos iniciais grátis; NULL = padrão (50% dos publicados, arredondado para baixo, mín. 3).
- (Manter `stories.is_free` e `chapters.is_free` como override manual/admin.)
- RPC/ função de acesso: `has_access(user_id, chapter_id)` **ou** função SQL `can_read_chapter(user_id, chapter_id)` que devolve `true` se:
  - `stories.is_free` ou `chapters.is_free`, OU
  - `chapter.number <= limite prévia` (calculado de `preview_chapter_limit` ou padrão), OU
  - existe `purchases` com `status='completed'` e `kind='story'` (e `story_id` = capítulo) OU `kind='chapter'` (e `chapter_id`).
- Adicionar índice `purchases(user_id, story_id)` se não existir.

### 2.2 Regras de acesso (server-side, única fonte de verdade)
- `src/lib/data/reader.ts`: substituir a checagem `!ch.is_free` por chamada a `can_read_chapter` (RPC) ou lógica equivalente já com prévia.
- `src/lib/data/stories.ts` (`getStoryBySlug`): `ownsStory` passa a considerar compra `kind='story'`.
- **RLS**: política `select` em `chapter_contents` (se content estiver separado) — atualmente o content vem via join; garantir que a app não entrega `content` de capítulo pago sem entitlement. Manter RLS existente + validação na app.
- `UnlockScreen.tsx`: mostrar "Capítulos 1–N grátis" dinâmico; CTA "Comprar obra" (já existe `/comprar/[slug]`).

### 2.3 Admin
- `StoryForm` (admin): campo "Capítulos grátis (prévia)" (`preview_chapter_limit`), com ajuda: "vazio = 50% dos publicados, mín. 3".
- `updateStory` action: gravar o novo campo.
- `payments.ts` admin: aprovação manual já funciona para `kind='story'` — verificar.

### 2.4 Migração de dados existentes
- Histórias atuais: `price_cents = null` (todas grátis de facto). Ajustar via admin quais passam a pagas e definir `preview_chapter_limit`.

---

## FASE 3 — Personagens (`characters`)
- Nova tabela `characters` (migração `0008`):
  - `id uuid pk`, `story_id uuid fk → stories`, `name text`, `role text`, `image_url text`, `description text`, `created_at`
  - RLS: select para todos (público), escrita só admin.
- `CharacterCard` em `src/components/stories/` (imagem, nome, papel, descrição curta).
- Página `/historias/[slug]`: secção "Personagens" (abaixo do sinopse), grid de cards, só renderiza se houver personagens.
- Admin: CRUD de personagens (formulário com upload ou URL de imagem).
- Seed: 0 personagens inicialmente; o utilizador adiciona via admin.

---

## FASE 4 — Itens adiados (região, IA)
- **Região Vercel**: manter `iad1`; medir após Fase 1; se ainda lento, considerar `gru1`/`cpt1` no dashboard (Pro). Não criar `vercel.json` agora.
- **Geração IA**: definir depois (LLM, API key, fluxo de moderação, prompt +16).

---

## Ordem de execução e critérios de verificação
1. Fase 1 (velocidade) → build verde, medição antes/depois, 0 regressões (smoke: login, explorar, ler capítulo grátis, capítulo pago bloqueado).
2. Fase 2 (paywall) → testar: anónimo vê prévia; comprador lê tudo; não-comprador bloqueado no capítulo N+1; admin aprova compra; RPC `has_access` revogada para anónimo.
3. Fase 3 (personagens) → CRUD admin + render público.

## Ficheiros principais a alterar
- `src/lib/supabase/server.ts`, `src/lib/supabase/client.ts`, `src/lib/supabase/middleware.ts`
- `src/middleware.ts`, `src/app/(site)/layout.tsx`
- `src/lib/data/{stories,library,reader,payments,categories,banners}.ts`
- `src/lib/actions/{stories,admin,payments}.ts`
- `src/components/stories/StoryCard.tsx` (manter `<img>` — covers são SVG locais; `next/image` não otimiza SVG por defeito)
- Novos: `src/app/(site)/**/loading.tsx` (7), `src/components/stories/CharacterCard.tsx`, `supabase/migrations/0007_preview_por_historia.sql`, `supabase/migrations/0008_characters.sql`
