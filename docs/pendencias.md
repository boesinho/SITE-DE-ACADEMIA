# Pendências conhecidas

Itens identificados durante o desenvolvimento que ainda **não** foram tratados.

## Segurança

### Senha do usuário é gravada sem hash
- **Onde:** `backend/src/2controllers/usuarioController.js` (`inserir` e `atualizar`) e coluna `usuario.senha_usuario`.
- **Situação:** o valor de `senha_usuario` recebido no corpo da requisição é gravado exatamente como chegou (texto puro) e
  também é devolvido nas respostas de `GET /usuario` e `GET /usuario/:id`.
- **O que fazer depois:** aplicar hash antes de gravar (ex.: `bcrypt`), nunca devolver `senha_usuario` nas respostas
  e criar um fluxo de login que compare o hash.
- **Status:** apenas anotado; nenhuma correção feita de propósito.

### Rotas de `/usuario` sem autenticação
- Qualquer cliente que alcance a API pode listar, criar, alterar e excluir usuários. Hoje o uso é só local (CORS restrito a
  `http://localhost:5173`), mas isso precisa ser tratado antes de qualquer publicação.
