-- ETAPA 3 — Pseudónimo artístico público único: "Helena Vasconcelos"
--
-- O site passa a atribuir publicamente toda a ficção a um único autor de casa.
--
-- O que MUDA (apenas dados de exibição pública):
--   authors.pen_name -> 'Helena Vasconcelos'  (é o que o público vê)
--   profiles.bio     -> bio única de Helena   (consistente com o nome público)
--
-- O que NÃO muda (identificador interno, reservado ao admin):
--   profiles.name    -> 'Clara Monteiro', 'Beatriz Nogueira', 'Rafael Andrade'
--   auth.users       -> e-mails e credenciais intactos (clara./beatriz./rafael.)
--
-- Os nomes públicos fictícios anteriores eram exactamente os de profiles.name,
-- logo nenhum dado real (ex.: Keide Zecas) estava ou passa a ser exposto.
--
-- ROLLBACK (repor estado anterior):
--   update public.authors set pen_name = 'Clara Monteiro'  where profile_id = '20b5ecd3-a70c-4796-8cc4-c4318d476b2c';
--   update public.authors set pen_name = 'Beatriz Nogueira' where profile_id = '79df9197-a43d-443b-a05a-01378434de64';
--   update public.authors set pen_name = 'Rafael Andrade'   where profile_id = '2987dddb-7c4e-4a83-8920-86f94885f4a3';
--   update public.profiles set bio = 'Autora de romances intensos sobre segundas chances e paixões proibidas. Acredita que o amor sempre encontra um caminho — mesmo quando não deveria.' where id = '20b5ecd3-a70c-4796-8cc4-c4318d476b2c';
--   update public.profiles set bio = 'Fascinada por heróis complicados, heroínas teimosas e finais que doem bem.' where id = '79df9197-a43d-443b-a05a-01378434de64';
--   update public.profiles set bio = 'Contador de histórias de campus, amizades que viram outra coisa e beijos inesperados.' where id = '2987dddb-7c4e-4a83-8920-86f94885f4a3';

update public.authors
set pen_name = 'Helena Vasconcelos',
    is_approved = true,
    updated_at = now()
where profile_id in (
  '20b5ecd3-a70c-4796-8cc4-c4318d476b2c',
  '79df9197-a43d-443b-a05a-01378434de64',
  '2987dddb-7c4e-4a83-8920-86f94885f4a3'
);

update public.profiles
set bio = 'Helena Vasconcelos escreve romances intensos sobre segundas chances, paixões proibidas e finais que doem bem. Acredita que o amor sempre encontra um caminho — mesmo quando não deveria.',
    updated_at = now()
where id in (
  '20b5ecd3-a70c-4796-8cc4-c4318d476b2c',
  '79df9197-a43d-443b-a05a-01378434de64',
  '2987dddb-7c4e-4a83-8920-86f94885f4a3'
);
