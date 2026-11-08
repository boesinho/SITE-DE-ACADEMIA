-- =====================================================================
-- 04_normaliza_quebras_de_linha.sql  |  Kaizen Gym
-- Corrige as receitas do seed (02_seed_receitas.sql).
--
-- PROBLEMA: o arquivo 02 foi salvo com quebras de linha do Windows (CRLF),
-- e as quebras de linha dentro dos textos de "ingredientes" e "modo_preparo"
-- foram gravadas como \r\n. A API grava receitas novas apenas com \n, entao
-- as receitas do seed ficaram diferentes das demais e, ao dividir a lista de
-- ingredientes por linha, cada item sobraria com um \r no final.
--
-- O QUE FAZ: remove o caractere \r (retorno de carro) desses dois campos.
-- Cada \r\n vira \n. Textos que ja estao corretos nao sao alterados.
--
-- Rodar DEPOIS do 02. E seguro rodar mais de uma vez.
-- =====================================================================

UPDATE receita
SET ingredientes = replace(ingredientes, E'\r', ''),
    modo_preparo = replace(modo_preparo, E'\r', '')
WHERE ingredientes LIKE E'%\r%'
   OR modo_preparo LIKE E'%\r%';

-- Conferencia: o resultado esperado e 0 (nenhuma receita com \r restante).
SELECT count(*) AS receitas_com_cr
FROM receita
WHERE ingredientes LIKE E'%\r%'
   OR modo_preparo LIKE E'%\r%';
