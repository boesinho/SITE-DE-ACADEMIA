# Kaizen Gym — Frontend

Site do Kaizen Gym feito com **React 19**, **Vite** e **React Router**. Consome a API do backend (Express) para listar, cadastrar, editar e excluir receitas fitness.

## Páginas

| Rota | Página |
| --- | --- |
| `/` | Início: benefícios da musculação, 3 pilares e receitas em destaque |
| `/receitas` | Receitas fitness com filtro por categoria (guardado na URL), detalhes, cadastro, edição e exclusão |

Qualquer outra rota volta para o início.

## Como rodar

```bash
npm install
npm run dev
```

O site abre em **http://localhost:5173**. A porta é fixa porque o CORS do backend só libera essa origem. O backend precisa estar rodando em `http://localhost:3000` (veja o [README da raiz](../README.md)).

## Variáveis de ambiente

O endereço da API vem de `VITE_API_URL`. Se o arquivo `frontend/.env` não existir, o padrão é `http://localhost:3000`. Para personalizar:

```bash
cp .env.example .env
```

## Scripts

| Comando | O que faz |
| --- | --- |
| `npm run dev` | Servidor de desenvolvimento do Vite |
| `npm run build` | Gera o build de produção em `dist/` |
| `npm run preview` | Serve o build localmente |
| `npm run lint` | Roda o ESLint |

## Estrutura de `src/`

- `pages/` — páginas (`Home`, `Receitas`)
- `components/` — componentes reutilizáveis (Navbar, Hero, cards, modais, formulário)
- `hooks/` — hooks, como `useReceitas`
- `services/api.js` — chamadas à API com `fetch`
- `config/` — dados fixos do site e categorias de receita
- `utils/` — funções auxiliares de formatação
