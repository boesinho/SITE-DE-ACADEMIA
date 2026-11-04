# Guia: levar o banco do psycool para o Supabase

Passo a passo para colocar o banco do projeto na nuvem e conectar o app nele.
Ao longo do guia aparecem estes marcadores: `SEU_REF`, `SEU_HOST`, `SUA_SENHA`. Troque pelos valores do SEU projeto. Nunca escreva a senha real em arquivo que vai pro GitHub.

---

## Visão geral (o que estamos fazendo e por quê)

Hoje cada pessoa do grupo tem um banco local diferente, e por isso vivemos fazendo backup e restore. A ideia é ter **um banco só, na nuvem**, que todo mundo usa.

Pense numa mudança de casa: primeiro criamos a casa nova (Passo 1), testamos se a chave abre a porta (Passo 2), levamos as caixas (Passo 3), conferimos se nada ficou pra trás (Passo 4) e só então trocamos o endereço no cadastro (Passo 5).

O que muda no projeto é pouco: o código continua igual, só passa a apontar pra outro endereço, que fica num arquivo `.env`.

---

## O que você precisa antes de começar

- Uma conta no Supabase (supabase.com). Dá pra entrar com o GitHub.
- O PostgreSQL 17 instalado (precisamos das ferramentas `psql` e `pg_restore`).
- O arquivo de backup do banco (o que fica na pasta `Bancodedados` do repositório).
- O projeto rodando com Node.

---

## Passo 1: criar o projeto no Supabase

1. Entre em supabase.com e crie a conta.
2. Se ele pedir uma organização, crie uma (plano Free).
3. Clique em **New project** e dê o nome `psycool`.
4. Defina a **senha do banco** e guarde num lugar seguro. Não cole em chat, Jira nem arquivo do projeto.
5. Escolha a região mais próxima (se aparecer São Paulo, é a melhor).
6. Espere o projeto ficar pronto.

Sobre o plano gratuito (confira os números atuais no site, porque mudam): ele tem limite de espaço por projeto e **pausa o projeto depois de 7 dias sem uso**. Pausado, os dados ficam guardados, mas o banco sai do ar até alguém restaurar pelo painel.

---

## Passo 2: testar a conexão

1. No painel do projeto, clique em **Connect** (fica no topo).
2. Copie a string do **Session pooler**. Ela se parece com:

```
postgresql://postgres.SEU_REF:[YOUR-PASSWORD]@SEU_HOST:5432/postgres
```

3. Apague só o trecho `:[YOUR-PASSWORD]`. A senha fica de fora de propósito: o psql vai pedir, e ela não fica gravada no histórico do terminal.
4. No CMD, rode o psql chamando **pelo caminho completo**, com a string entre aspas:

```
"C:\Program Files\PostgreSQL\17\bin\psql.exe" "postgresql://postgres.SEU_REF@SEU_HOST:5432/postgres"
```

5. Digite a senha do projeto quando pedir (não aparece nada enquanto digita, é normal).
6. Se entrou, o prompt vira `postgres=>`. Rode `SELECT version();` e depois `\q` para sair.

Por que o Session pooler? A conexão direta usa IPv6, e nem toda rede suporta. O pooler funciona nas redes que só têm IPv4 (faculdade, trabalho).

Por que chamar o psql pelo caminho completo? O atalho "SQL Shell" do menu Iniciar pode ser de uma versão antiga e dar o erro "método de autenticação 10 não é suportado".

---

## Passo 3: restaurar o backup no Supabase

1. Entre no psql (Passo 2) e rode `\dt`. Deve responder que não encontrou nenhuma relação, porque o banco está vazio. Saia com `\q`.
2. No CMD, rode o restore:

```
"C:\Program Files\PostgreSQL\17\bin\pg_restore.exe" --host=SEU_HOST --port=5432 --username=postgres.SEU_REF --dbname=postgres --no-owner --no-privileges --verbose "CAMINHO-DO-BACKUP"
```

3. Digite a senha do projeto.
4. Vai aparecer uma lista longa. Olhe o final: se aparecer `errors ignored on restore: N`, veja quais foram os erros.

O que cada opção faz:
- `--no-owner` e `--no-privileges`: não tenta reaplicar donos e permissões do banco original (esses usuários não existem no Supabase e virariam erro à toa).
- Não usamos `--clean --create`: o banco `postgres` do Supabase já tem coisas do próprio Supabase dentro, então só colocamos as nossas tabelas, sem apagar nada.

---

## Passo 4: conferir se chegou tudo

Pode ser no psql ou no **SQL Editor** do painel do Supabase (o editor de SQL no navegador).

1. Liste as tabelas: `\dt` (no SQL Editor não existe `\dt`, use o **Table Editor** ou `SELECT tablename FROM pg_tables WHERE schemaname = 'public';`).
2. Compare a quantidade de dados com o banco local:

```
SELECT count(*) FROM usuario;
```

3. Teste o trigger de criptografia de senha, sem deixar nada gravado (o `ROLLBACK` desfaz tudo):

```
BEGIN;
INSERT INTO usuario (tipo_usuario, email_usuario, senha_usuario) VALUES ('Cliente', 'teste.supabase@teste.com', 'abc123');
SELECT email_usuario, senha_usuario FROM usuario WHERE email_usuario = 'teste.supabase@teste.com';
ROLLBACK;
```

A senha deve aparecer como um hash começando com `$2a$`, e não como `abc123`. Se aparecer erro de função que não existe (`gen_salt`), o `pgcrypto` não veio certo.

---

## Passo 5: conectar o projeto (o `.env`)

### 5.1 Garanta que o Git ignora o `.env`

Abra o `.gitignore` e confira se existe uma linha `.env`. Se não existir, adicione. Faça isso **antes** de criar o `.env`, senão a senha pode ir pro GitHub por engano.

### 5.2 Instale o dotenv

```
npm install dotenv
```

Ele lê o arquivo `.env` e transforma cada linha em uma variável que o código acessa por `process.env`.

### 5.3 Crie o `.env`

Na raiz do projeto (mesmo nível do `package.json`), com **uma variável por linha**, sem aspas e sem espaço em volta do `=`:

```
DB_HOST=SEU_HOST
DB_PORT=5432
DB_NAME=postgres
DB_USER=postgres.SEU_REF
DB_PASSWORD=SUA_SENHA
```

Rode `git status`: o `.env` **não pode aparecer** na lista.

Crie também o `.env.example`, igual ao `.env` mas **sem os valores**. Ele vai pro Git e serve de molde pro pessoal:

```
DB_HOST=
DB_PORT=
DB_NAME=
DB_USER=
DB_PASSWORD=
```

### 5.4 Carregue o `.env` no `index.js`

Como **primeira linha** do `index.js`:

```javascript
require('dotenv').config();
```

Precisa ser a primeira porque o Node lê o arquivo de cima pra baixo, e o `config/database.js` lê as variáveis assim que é carregado.

### 5.5 Ajuste o `config/database.js`

```javascript
const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        dialect: 'postgres',
        logging: false,
        dialectOptions: {
            ssl: { rejectUnauthorized: false }
        }
    }
);
```

A ordem dos três primeiros argumentos importa: **banco, usuário, senha**. O `ssl` liga a conexão criptografada (o Supabase pode exigir isso). O `rejectUnauthorized: false` não valida o certificado do servidor, o que é comum em projeto de faculdade.

### 5.6 Reinicie o servidor e teste

O `dotenv` só lê o `.env` quando o servidor liga, então sempre reinicie depois de mexer nele. Faça um `GET /usuario` no Thunder Client.

---

## Passo 6: provar que o app grava na nuvem

1. Com o servidor rodando, cadastre algo pelo formulário (por exemplo, um psicólogo de teste com um CRP que ainda não exista).
2. Procure o registro no Supabase (`SELECT * FROM psicologo ORDER BY id_psicologo DESC LIMIT 1;`). Ele deve aparecer.
3. Rode a mesma consulta no banco **local**. Ele **não** deve aparecer. Se não apareceu, o app está gravando na nuvem.

---

## Passo 7: trancar a Data API do Supabase

O Supabase cria sozinho uma API (REST e GraphQL) em cima do banco. Por padrão ela expõe o schema `public`, que é onde ficam as nossas tabelas. Se uma tabela estiver sem RLS (segurança por linha) e com permissão pro papel `anon`, quem tiver a URL do projeto e a chave `anon` consegue ler e alterar os dados por essa API, sem passar pelo nosso Express.

Como o nosso app conversa direto com o banco pelo Sequelize e **nunca usa essa API**, o caminho simples é desligá-la.

Para diagnosticar antes:

```
SELECT tablename, rowsecurity FROM pg_tables WHERE schemaname = 'public';
SELECT has_table_privilege('anon', 'public.usuario', 'select');
```

Se as tabelas estão com `rowsecurity = false` e a segunda consulta volta `true`, a porta estava aberta.

Para fechar: no painel, vá em **API Settings** e, em **Data API Settings**, desligue **Enable Data API** (os nomes podem variar um pouco). Depois faça um `GET /usuario` pra confirmar que o app segue funcionando.

---

## Passo 8: entregar o acesso pro grupo

Combinem entre vocês como fazer isso. Regras de ouro:

- O `.env` **nunca** vai pro GitHub, nem pro Jira, nem pro README.
- Quem tem a senha manda pros colegas por mensagem privada (ou um gerenciador de senhas), e não no grupo aberto.
- Cada pessoa cria o **seu** `.env` a partir do `.env.example` e preenche com os valores recebidos.
- Depois do `git pull`, rodar `npm install` (sem nome de pacote) baixa tudo que está listado no `package.json`, incluindo o `dotenv`.

Como o banco agora é compartilhado, **todo mundo enxerga o mesmo dado**. Um `DELETE` ou `UPDATE` em massa afeta o grupo inteiro, então avisem antes de mexer em dados que outros estejam usando.

Se quiser voltar ao banco local em algum momento, basta trocar os valores do seu `.env`. O código não muda.

---

## Erros que já apareceram (e como resolver)

| O que aparece | Causa provável | Solução |
|---|---|---|
| `método de autenticação 10 não é suportado` | psql de versão antiga (atalho SQL Shell) | Chamar o psql 17 pelo caminho completo |
| `Password for user` com o nome do seu usuário do Windows | Rodou o psql sem a string de conexão | Passar a string entre aspas depois do `.exe` |
| `\dt` não responde e o prompt vira `postgres->` | Digitou `/dt` (barra normal) | Usar barra invertida `\dt`; digitar `\r` para limpar |
| `getaddrinfo ENOTFOUND` com o resto do `.env` dentro da mensagem | Variáveis do `.env` na mesma linha | Uma variável por linha e reiniciar o servidor |
| `database "postgres.xxxx" does not exist` | `DB_NAME` e `DB_USER` trocados no `.env` | Conferir os valores; o nome do banco é `postgres` |
| `Cannot find module 'dotenv'` | Não rodou `npm install` depois do `pull` | Rodar `npm install` |
| `SSL connection is required` | O Supabase exige conexão criptografada | Configurar o `ssl` no `database.js` (Passo 5.5) |
| Muitos erros `already exists` ao restaurar | Restaurou em cima de um banco que já tinha dados | Restaurar num banco vazio |
| Conexão não abre / demora e falha | Rede sem suporte a IPv6 | Usar a string do Session pooler, não a direta |

Atenção: mensagens de erro de conexão podem mostrar o conteúdo do `.env`. Antes de colar um erro em qualquer lugar, tire a senha.
