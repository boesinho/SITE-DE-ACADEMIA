-- =====================================================================
-- 03_rls.sql  |  Kaizen Gym
-- Liga o Row Level Security (RLS) em todas as tabelas do projeto.
-- Rodar DEPOIS do 01_receita.sql (a tabela "receita" precisa existir).
--
-- POR QUE ISSO:
-- O Supabase expoe automaticamente uma API publica (Data API / PostgREST)
-- sobre as tabelas do schema "public". Qualquer pessoa com a chave
-- publica (anon key) poderia, por essa API, ler ou alterar as tabelas
-- que estiverem sem RLS.
--
-- Com o RLS LIGADO e SEM nenhuma policy criada, esses papeis publicos
-- (anon / authenticated) nao enxergam nenhuma linha e nao conseguem
-- gravar nada. Ou seja, a API publica do Supabase fica fechada.
--
-- O QUE NAO MUDA PARA O NOSSO BACKEND:
-- O backend Node conecta direto no Postgres como o usuario "postgres"
-- (connection string do Session pooler), e esse papel IGNORA o RLS
-- (tem o atributo BYPASSRLS). Por isso a nossa API Express continua
-- lendo e gravando normalmente. Nao usamos FORCE ROW LEVEL SECURITY,
-- que faria o RLS valer ate para o dono da tabela.
--
-- Resumo: isto SO fecha o acesso pela API publica do Supabase; nao
-- afeta o backend.
--
-- E seguro rodar mais de uma vez (ENABLE ROW LEVEL SECURITY e idempotente).
-- =====================================================================

ALTER TABLE usuario          ENABLE ROW LEVEL SECURITY;
ALTER TABLE exercicio        ENABLE ROW LEVEL SECURITY;
ALTER TABLE rotina           ENABLE ROW LEVEL SECURITY;
ALTER TABLE rotina_exercicio ENABLE ROW LEVEL SECURITY;
ALTER TABLE receita          ENABLE ROW LEVEL SECURITY;
