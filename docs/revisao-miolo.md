# Revisao estrutural | miolo

## O que entra do universo bernardosilva.site

### Conteudo

- Entram os ensaios de `gastronomia` e `produto`, porque sao os recortes que ja comunicam valor comercial de forma objetiva.
- Entram as galerias completas por ensaio, porque elas resolvem a navegacao do cliente melhor do que um grid solto.
- Entra o bloco de contato direto com `email`, `WhatsApp` e `Instagram`, porque ele ja esta validado como caminho curto para projeto e orcamento.
- Entram os `metadados` de preview (`title`, `description`, `og`, `twitter`) porque eles sao essenciais para compartilhamento e leitura institucional.

### O que nao entra do jeito que estava

- `Acervos` e ensaios sem funcao comercial clara nao sobem como categoria publica da Miolo.
- A logica do Bernardo centrada no autor vira logica de `estudio`.
- `Hospitalidade` continua no posicionamento verbal da marca, mas nao aparece ainda como categoria publica enquanto nao houver recorte visual consistente para essa frente.

## Como a Miolo passa a funcionar

### Arquitetura do site

- `home`: abre com a faixa editorial e desce para categorias, ensaios selecionados, servicos, sobre e contato.
- `categorias/gastronomia`: lista todos os ensaios de gastronomia.
- `categorias/produto`: lista todos os ensaios de produto.
- `ensaios/<slug>`: cada ensaio ganha pagina propria com capa, metadata e galeria completa.

### Estrutura de pastas

```text
miolo/
  assets/
    css/site.css
    js/site.js
    js/site-data.js
  categorias/
    gastronomia/index.html
    produto/index.html
  docs/
    revisao-miolo.md
  ensaios/
    <slug>/index.html
  img/
    <pastas-dos-ensaios>/
    brand/
    grid/
  scripts/
    build-site.mjs
  index.html
```

### Estrutura editorial dos ensaios

- Cada pasta de ensaio continua em `img/<nome-da-pasta>/`.
- Cada ensaio tem:
  - `slug` publico
  - `categoria`
  - `titulo`
  - `ano`
  - `cover`
  - `blurb`
  - lista de imagens
- A geracao das paginas parte de uma fonte unica de dados no script de build, para evitar divergencia entre home, categorias e ensaios.

## Criterio de curadoria publica

- `gastronomia`: sobe completa.
- `produto`: sobe completa.
- `hospitalidade`: fica prevista no discurso da marca, mas nao publicada como categoria ate existir corpo de trabalho proprio.
- `acervo/autoral`: so entra se houver funcao estrategica real para a Miolo.

## O que ja foi executado localmente

- Base de `home`, `categorias` e `ensaios` gerada por script, sem alterar nada do que esta publicado.
- Estrutura de assets separada em `assets/css` e `assets/js`, para a Miolo parar de depender de um unico `index.html` monolitico.
- Importacao local dos ensaios `20240427-Copa-Cozinha` e `20241022-Casa-Gabo`, que existiam no universo Bernardo e ainda nao estavam copiados para a Miolo local.
- Padronizacao inicial da navegacao para o cliente: categoria, ensaio, metadata e contato direto.

## Como devemos operar daqui pra frente

- Novo ensaio entra primeiro em `img/<pasta-do-ensaio>/`.
- Depois recebe cadastro no `scripts/build-site.mjs` com `slug`, `categoria`, `titulo`, `ano`, `cover`, `gridCover` e `blurb`.
- Em seguida rodamos o build local para atualizar:
  - `index.html`
  - `categorias/*/index.html`
  - `ensaios/*/index.html`
  - `assets/js/site-data.js`
- So depois de validar localmente decidimos se algo vai ou nao para o publicado.

## Proxima camada recomendada

- Subir uma pagina institucional separada de `sobre/abordagem`, caso a Miolo precise de uma narrativa mais completa para envio comercial.
- Criar, quando houver material suficiente, a categoria publica `hospitalidade`.
- Definir uma biblioteca fixa de capas de grid para evitar improviso de curadoria a cada novo ensaio.
