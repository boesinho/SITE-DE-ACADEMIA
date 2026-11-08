-- =====================================================================
-- 01_receita.sql  |  Kaizen Gym
-- Cria a tabela "receita". Rodar no SQL Editor do Supabase.
--
-- E seguro rodar mais de uma vez: o IF NOT EXISTS evita erro (e nao
-- apaga nem altera nada) se a tabela ja existir.
--
-- Ordem de execucao: 01 -> 02 -> 03.
-- =====================================================================

CREATE TABLE IF NOT EXISTS receita (
    id_receita       serial        PRIMARY KEY,

    -- UNIQUE: nao pode haver duas receitas com o mesmo nome.
    nome_receita     varchar(120)  NOT NULL UNIQUE,

    -- O CHECK garante no banco que so entram categorias conhecidas,
    -- mesmo que alguem insira direto pelo SQL Editor (sem passar pela API).
    categoria        varchar(20)   NOT NULL
                     CHECK (categoria IN ('cafe_da_manha', 'pre_treino', 'pos_treino', 'almoco_jantar', 'lanche')),

    descricao_curta  varchar(255),

    -- Um ingrediente por linha.
    ingredientes     text          NOT NULL,
    modo_preparo     text          NOT NULL,

    tempo_preparo_min int          NOT NULL CHECK (tempo_preparo_min > 0),

    -- Valores nutricionais sao opcionais (podem ficar NULL).
    calorias         int           CHECK (calorias >= 0),
    -- numeric(5,1): ate 4 digitos antes da virgula e 1 depois (maximo 9999.9).
    proteina_g       numeric(5,1)  CHECK (proteina_g >= 0),

    created_at       timestamptz   DEFAULT now()
);
