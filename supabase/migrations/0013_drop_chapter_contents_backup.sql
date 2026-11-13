-- Remove backup antigo de chapter_contents criado antes da migração 0010.
-- A tabela atual public.chapter_contents contém os 42 capítulos atualizados.
-- O backup não é referenciado pelo código e estava exposto sem RLS.

drop table if exists public.chapter_contents_bak_0010;
