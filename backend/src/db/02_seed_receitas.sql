-- =====================================================================
-- 02_seed_receitas.sql  |  Kaizen Gym
-- Insere 7 receitas iniciais. Rodar DEPOIS do 01_receita.sql.
--
-- E seguro rodar mais de uma vez: ON CONFLICT (nome_receita) DO NOTHING
-- faz o banco ignorar a receita que ja existe, sem erro e sem duplicar.
--
-- ATENCAO: os valores de "calorias" e "proteina_g" sao APROXIMADOS,
-- estimados por porcao com base em tabelas nutricionais comuns. Servem
-- como referencia para o site e NAO substituem orientacao de nutricionista.
-- =====================================================================

INSERT INTO receita
    (nome_receita, categoria, descricao_curta, ingredientes, modo_preparo, tempo_preparo_min, calorias, proteina_g)
VALUES
(
    'Panqueca de banana com aveia',
    'pre_treino',
    'Panqueca simples de banana, ovo e aveia, boa fonte de carboidrato para comer antes do treino.',
    '1 banana madura média
1 ovo
2 colheres de sopa de aveia em flocos
1 pitada de canela em pó
Óleo de coco ou spray culinário para untar a frigideira',
    '1. Amasse bem a banana com um garfo.
2. Misture o ovo, a aveia e a canela até formar uma massa homogênea.
3. Aqueça uma frigideira antiaderente levemente untada em fogo médio.
4. Despeje porções da massa e deixe dourar por cerca de 2 minutos de cada lado.
5. Sirva em seguida, de preferência 30 a 60 minutos antes do treino.',
    15, 260, 10.5
),
(
    'Frango grelhado com batata-doce',
    'almoco_jantar',
    'Prato clássico de academia: proteína magra do frango com carboidrato de absorção lenta da batata-doce.',
    '150 g de peito de frango
200 g de batata-doce
1 colher de chá de azeite
Suco de 1/2 limão
2 dentes de alho amassados
Sal, pimenta-do-reino e ervas a gosto
Salada de folhas para acompanhar',
    '1. Tempere o frango com o alho, o limão, o sal e a pimenta e deixe descansar por 10 minutos.
2. Corte a batata-doce em cubos ou rodelas e cozinhe em água fervente por cerca de 15 minutos, até ficar macia.
3. Aqueça uma frigideira ou grelha com o azeite em fogo médio-alto.
4. Grelhe o frango por 5 a 6 minutos de cada lado, até dourar e cozinhar por completo.
5. Sirva com a batata-doce e a salada.',
    35, 400, 37.0
),
(
    'Omelete de claras com espinafre',
    'cafe_da_manha',
    'Omelete leve e rica em proteína, com poucas calorias e fácil de preparar.',
    '4 claras de ovo
1 ovo inteiro
1 punhado de folhas de espinafre picadas
1 colher de chá de azeite
Sal e pimenta-do-reino a gosto',
    '1. Bata as claras e o ovo inteiro com o sal e a pimenta.
2. Aqueça o azeite em uma frigideira antiaderente em fogo médio.
3. Refogue o espinafre por cerca de 1 minuto, até murchar.
4. Despeje os ovos batidos por cima e deixe firmar por 2 a 3 minutos.
5. Dobre a omelete ao meio e sirva quente.',
    10, 180, 21.0
),
(
    'Overnight oats',
    'cafe_da_manha',
    'Aveia hidratada na geladeira durante a noite: o café da manhã já fica pronto de um dia para o outro.',
    '4 colheres de sopa de aveia em flocos (cerca de 40 g)
150 g de iogurte natural
100 ml de leite ou bebida vegetal
1 colher de sopa de chia
1/2 banana em rodelas ou frutas vermelhas
Mel a gosto (opcional)',
    '1. Em um pote com tampa, misture a aveia, o iogurte, o leite e a chia.
2. Tampe e leve à geladeira por pelo menos 6 horas (de preferência durante a noite).
3. Na hora de comer, mexa bem e cubra com a banana ou as frutas vermelhas.
4. Finalize com um fio de mel, se quiser.
O tempo informado considera apenas o preparo; o descanso na geladeira é à parte.',
    10, 390, 16.0
),
(
    'Crepioca com frango desfiado',
    'pos_treino',
    'Mistura de crepe e tapioca recheada com frango, ótima para repor proteína depois do treino.',
    '1 ovo
2 colheres de sopa de goma de tapioca (cerca de 30 g)
80 g de frango cozido e desfiado
Tomate picado a gosto
Sal e orégano a gosto',
    '1. Bata o ovo com a goma de tapioca e uma pitada de sal até ficar homogêneo.
2. Despeje em uma frigideira antiaderente aquecida e deixe cozinhar por cerca de 2 minutos.
3. Vire e cozinhe mais 1 minuto.
4. Recheie com o frango desfiado, o tomate e o orégano.
5. Dobre ao meio e sirva.',
    15, 310, 31.0
),
(
    'Iogurte com frutas e granola',
    'lanche',
    'Lanche rápido, sem fogão, com proteína do iogurte e crocância da granola.',
    '170 g de iogurte natural
1/2 xícara de morangos ou outra fruta picada
2 colheres de sopa de granola (cerca de 30 g)
1 colher de chá de mel (opcional)',
    '1. Coloque o iogurte em uma tigela.
2. Adicione as frutas picadas por cima.
3. Finalize com a granola e, se quiser, um fio de mel.
4. Coma logo depois de montar, para a granola não amolecer.',
    5, 280, 9.5
),
(
    'Wrap integral de frango',
    'almoco_jantar',
    'Refeição prática e fácil de levar: wrap integral recheado com frango desfiado e salada.',
    '1 tortilha (wrap) integral
100 g de frango cozido e desfiado
2 folhas de alface
3 rodelas de tomate
1 colher de sopa de requeijão light ou iogurte natural
Sal, pimenta-do-reino e orégano a gosto',
    '1. Misture o frango desfiado com o requeijão (ou iogurte), o sal, a pimenta e o orégano.
2. Aqueça a tortilha por 20 a 30 segundos em uma frigideira seca para ficar flexível.
3. Distribua a alface, o tomate e o frango sobre a tortilha.
4. Enrole, dobrando as pontas para dentro, e corte ao meio.',
    15, 330, 36.0
)
ON CONFLICT (nome_receita) DO NOTHING;
