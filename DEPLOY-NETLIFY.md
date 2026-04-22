# Deploy no Netlify

## O que este projeto usa

- Site estático publicado a partir da raiz do projeto.
- Função serverless em `netlify/functions/instagram-feed.js`.
- Feed do front-end apontando para `/.netlify/functions/instagram-feed`.

## Variáveis de ambiente

Cadastre estas variáveis no painel do Netlify:

- `INSTAGRAM_USER_ID`
- `INSTAGRAM_ACCESS_TOKEN`

## Passo a passo

1. Envie este projeto para um repositório no GitHub.
2. No Netlify, clique em `Add new site` > `Import an existing project`.
3. Conecte o repositório.
4. Confirme as configurações detectadas pelo `netlify.toml`.
5. Em `Site configuration` > `Environment variables`, adicione `INSTAGRAM_USER_ID` e `INSTAGRAM_ACCESS_TOKEN`.
6. Faça um novo deploy.

## Como obter os dados da Meta

Você precisa de:

- Uma conta Instagram Business ou Creator.
- Uma página do Facebook vinculada a essa conta.
- Um app na Meta com permissões compatíveis com leitura de mídia do Instagram.
- O `INSTAGRAM_USER_ID` da conta.
- Um token válido de acesso da API do Instagram/Graph.

## Resultado esperado

Depois do deploy, a URL abaixo deve responder com JSON:

`/.netlify/functions/instagram-feed`

O site passará a exibir automaticamente as 3 últimas postagens com imagem, legenda e link.