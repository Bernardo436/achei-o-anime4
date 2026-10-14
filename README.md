# Achei o Anime

Site onde você descreve o personagem (ou envia um print da cena) e descobre de qual anime ele é, em que episódio aparece e onde assistir de forma oficial no Brasil.

## Como funciona

1. **Descrição** → uma IA interpreta as características e sugere personagens prováveis.
2. **AniList** confirma cada palpite e traz a foto do personagem, a capa do anime e os links oficiais de streaming.
3. **Print da cena (opcional)** → o trace.moe encontra o anime, o episódio e o minuto exato, com uma prévia em vídeo.
4. **Onde assistir** → o TMDB, com dados do JustWatch, mostra em quais plataformas o anime está no Brasil (assinatura, grátis, aluguel ou compra).

Só aparecem plataformas oficiais. Conteúdo adulto é filtrado.

## Estrutura

```
public/index.html   página do site
api/search.js       busca (descrição + print + onde assistir)
api/health.js       mostra quais buscas estão ligadas
lib/ai.js           palpites da IA
lib/anilist.js      personagens, animes e links oficiais
lib/trace.js        busca por print
lib/tmdb.js         onde assistir no Brasil
test/               testes
```

## Publicar no Vercel

1. Suba a pasta para um repositório no GitHub e importe no Vercel (sem framework, as configurações padrão servem).
2. Em **Settings → Environment Variables**, cadastre as variáveis do arquivo `.env.example`:
   - `ANTHROPIC_API_KEY` para a busca por descrição
   - `TMDB_TOKEN` (opcional) para mostrar os logos das plataformas no Brasil
   - `TRACE_MOE_KEY` (opcional) para mais buscas por print
3. Faça um novo deploy.

O TMDB é opcional. Sem ele, o "Onde assistir" mostra os links oficiais cadastrados no AniList (Crunchyroll, Netflix etc.) e um botão para o JustWatch. A busca por print funciona sem nenhuma chave.

## Rodar localmente

```
npm i -g vercel
cp .env.example .env   # preencha as chaves
vercel dev
```

Testes: `npm test`

## Créditos dos dados

Personagens e capas: [AniList](https://anilist.co). Busca por cena: [trace.moe](https://trace.moe). Onde assistir: [JustWatch](https://www.justwatch.com/br) via [TMDB](https://www.themoviedb.org). O crédito ao JustWatch é exigido pelo TMDB e precisa continuar no rodapé.
