-- ETAPA 4 (parte 1) — Preços de teste + coerência da prévia
--
-- Contexto: o novo sistema de prévia (0007) liberta capítulos por
-- preview_percent/preview_min, mas os capítulos ainda tinham is_free
-- antigo/por-conta (2, 3 ou 6 conforme a história), o que conflitava
-- com a prévia e libertava capítulos para além do definido.
--
-- Regra de acesso no reader (src/lib/data/reader.ts):
--   entitled = story.is_free OR ch.is_free OR owner OR admin
--              OR compra OR ch.number <= preview_limit
-- Logo, num story pago, ch.number <= preview_limit (50% de 6 = 3) já
-- liberta os 3 primeiros capítulos. Definir is_free=false nos stories
-- pagos NÃO bloqueia a prévia — remove apenas a redundância/lixo antigo.
--
-- Preços (MT, guardados em cêntimos = MT x 100):
--   o-contrato-do-meu-inimigo   250,00 MT  (insignia / mais lida)
--   o-meu-chefe-meu-segredo     200,00 MT
--   casamento-por-engano        200,00 MT
--   proibido-amar-te            150,00 MT
--   a-promessa-que-quebramos    150,00 MT
--   depois-daquele-beijo        GRÁTIS (is_free=true, sem preço)
--   o-ultimo-verao              GRÁTIS (is_free=true, sem preço)
--
-- Os 2 stories gratuitos mantêm-se como isca/conversão gratuita.
--
-- ROLLBACK (repor estado anterior):
--   update public.stories set price_cents = null;
--   update public.chapters set is_free = true
--     where story_id in ('66a64f65-5f21-4b53-916d-2cae6593b8a1',
--                        '9d564782-f0ac-4e10-a8ae-fcb00b9f0551',
--                        'e86940f8-6794-4978-aca4-283f052cd7a0',
--                        'bee5afc9-845b-43ac-9056-d24593bceb5b',
--                        '70923342-b7fd-4ab9-972e-6df4ff28c1d8');

-- Preços de teste por história (MT -> cêntimos)
update public.stories set price_cents = 25000 where id = '66a64f65-5f21-4b53-916d-2cae6593b8a1';
update public.stories set price_cents = 20000 where id = '9d564782-f0ac-4e10-a8ae-fcb00b9f0551';
update public.stories set price_cents = 20000 where id = 'e86940f8-6794-4978-aca4-283f052cd7a0';
update public.stories set price_cents = 15000 where id = 'bee5afc9-845b-43ac-9056-d24593bceb5b';
update public.stories set price_cents = 15000 where id = '70923342-b7fd-4ab9-972e-6df4ff28c1d8';

-- Stories gratuitos: sem preço (o acesso é inteiro via stories.is_free)
update public.stories set price_cents = null, is_free = true
  where id in ('6b3254e9-ec1f-47a0-b7db-0926f9d6e281',   -- depois-daquele-beijo
               '5c112a3c-b881-49c9-9373-f58216cab852');  -- o-ultimo-verao

-- Nos stories pagos, a prévia governa: limpar is_free antigo dos capítulos
update public.chapters set is_free = false
  where story_id in ('66a64f65-5f21-4b53-916d-2cae6593b8a1',
                     '9d564782-f0ac-4e10-a8ae-fcb00b9f0551',
                     'e86940f8-6794-4978-aca4-283f052cd7a0',
                     'bee5afc9-845b-43ac-9056-d24593bceb5b',
                     '70923342-b7fd-4ab9-972e-6df4ff28c1d8');
