# Kaizen Gym

Site de musculação e alimentação fitness desenvolvido como projeto acadêmico do curso de Engenharia de Software, unindo programação com o mundo da academia.

*Kaizen* (改善) significa "melhoria contínua" em japonês: a ideia do site é melhorar um pouco a cada dia, no treino e na alimentação.

**O que o site tem hoje:**

- **Página inicial** com conteúdo sobre os benefícios da musculação, os 3 pilares (treino, alimentação e descanso) e receitas em destaque.
- **Receitas fitness** com CRUD completo: listar, filtrar por categoria, ver detalhes, cadastrar, editar e excluir.

## Estrutura do projeto

```
SITE-DE-ACADEMIA/
├── backend/               API REST (Node.js + Express + Sequelize)
│   ├── .env.example       molde das variáveis de ambiente
│   ├── package.json
│   └── src/
│       ├── index.js       ponto de entrada (porta 3000)
│       ├── config/        conexão com o banco
│       ├── 1models/       modelos do Sequelize
│       ├── 2controllers/  regras e validações de cada rota
│       ├── 3routes/       rotas do Express
│       ├── swagger/       documentação OpenAPI
│       └── db/            scripts SQL (01 → 04)
├── frontend/              site em React + Vite (porta 5173)
│   └── src/               páginas, componentes, hooks e serviço de acesso à API
├── docs/                  guias e pendências conhecidas
└── README.md
```

## Tecnologias

| Parte | Tecnologias |
| --- | --- |
| Backend | Node.js, Express 5, Sequelize, PostgreSQL, CORS, dotenv, Swagger UI |
| Banco de dados | PostgreSQL hospedado no [Supabase](https://supabase.com) |
| Frontend | React 19, Vite, React Router, ESLint |

## Como rodar

### 1. Pré-requisitos

- [Node.js](https://nodejs.org) (versão LTS recente) com npm
- Um projeto no Supabase

### 2. Instalar as dependências

```bash
cd backend
npm install

cd ../frontend
npm install
```

### 3. Configurar o `.env` do backend

O backend lê as variáveis de ambiente do arquivo **`backend/.env`**. Esse arquivo **não vai para o git** (está no `.gitignore`), então cada pessoa cria o seu a partir do molde:

```bash
cd backend
cp .env.example .env
```

Preencha as variáveis com os dados da conexão do Supabase (no projeto, botão **Connect** → **Session pooler**; a connection string tem o formato `postgres://postgres.<REF>:<SENHA>@<HOST>:5432/postgres`):

| Variável | O que colocar |
| --- | --- |
| `DB_NAME` | Nome do banco. No Supabase é `postgres` |
| `DB_USER` | Usuário, no formato `postgres.<REF>` (só `postgres` não funciona no pooler) |
| `DB_PASSWORD` | Senha do banco definida ao criar o projeto |
| `DB_HOST` | Host da connection string, o trecho depois do `@`. Ex.: `aws-0-sa-east-1.pooler.supabase.com` |
| `DB_PORT` | `5432` |

> Nunca envie o `.env` para o GitHub nem cole a senha em issues ou mensagens. Reinicie o backend depois de alterar o arquivo: o `dotenv` só lê o `.env` quando o servidor liga.

### 4. Criar as tabelas no Supabase

No Supabase, abra o **SQL Editor** e execute os scripts de `backend/src/db/` **nesta ordem**:

| Ordem | Script | O que faz |
| --- | --- | --- |
| 1 | `01_receita.sql` | Cria a tabela `receita` |
| 2 | `02_seed_receitas.sql` | Insere 7 receitas iniciais |
| 3 | `03_rls.sql` | Liga o Row Level Security, fechando a API pública do Supabase (o backend não é afetado) |
| 4 | `04_normaliza_quebras_de_linha.sql` | Remove o `\r` que sobrou nas receitas do seed |

Todos podem ser executados mais de uma vez sem duplicar nem quebrar nada.

> **Atenção:** o `03_rls.sql` também ativa o RLS nas tabelas `usuario`, `exercicio`, `rotina` e `rotina_exercicio`. Nenhum script desta pasta cria essas tabelas, então elas precisam já existir no banco; caso contrário o script dá erro.

### 5. Rodar o backend

```bash
cd backend
npm run dev
```

A API sobe em **http://localhost:3000**. O `npm run dev` reinicia o servidor sozinho quando um arquivo muda; para rodar sem isso, use `npm start`.

### 6. Rodar o frontend

Em outro terminal:

```bash
cd frontend
npm run dev
```

O site abre em **http://localhost:5173**.

- A porta 5173 é fixa: o CORS do backend só libera essa origem. Se ela estiver ocupada, o Vite avisa em vez de subir em outra porta.
- Por padrão o frontend usa a API em `http://localhost:3000`. Para apontar para outro endereço, crie `frontend/.env` a partir de `frontend/.env.example` e ajuste `VITE_API_URL`.

## API de receitas

Documentação interativa (Swagger): **http://localhost:3000/api-docs** (com o backend rodando).

| Método | Rota | Descrição |
| --- | --- | --- |
| `GET` | `/receitas` | Lista as receitas, ordenadas por id. Aceita `?categoria=` para filtrar |
| `GET` | `/receitas/:id` | Busca uma receita pelo id |
| `POST` | `/receitas` | Cadastra uma receita |
| `PUT` | `/receitas/:id` | Substitui uma receita por completo (o corpo precisa trazer a receita inteira) |
| `DELETE` | `/receitas/:id` | Exclui uma receita |

**Categorias válidas:** `cafe_da_manha`, `pre_treino`, `pos_treino`, `almoco_jantar` e `lanche`.

**Campos da receita:** `nome_receita`, `categoria`, `ingredientes`, `modo_preparo` e `tempo_preparo_min` são obrigatórios; `descricao_curta`, `calorias` e `proteina_g` são opcionais.

**Erros:** a API responde sempre no formato `{ "erro": "mensagem", "campos": [...] }` (o `campos` só aparece em erros de validação e de nome repetido). Os códigos usados são `400` (dados inválidos), `404` (receita não encontrada), `409` (já existe receita com esse nome) e `500` (erro interno).

O Swagger também documenta as rotas de `/usuario`.

## Pendências conhecidas

Itens ainda não tratados, como a ausência de hash de senha e de autenticação nas rotas de `/usuario`, estão listados em [`docs/pendencias.md`](docs/pendencias.md).
