import fs from "node:fs";
import path from "node:path";

const root = "/Users/baugustosilva/Documents/New project/miolo";
const imgDir = path.join(root, "img");
const outputDataFile = path.join(root, "assets/js/site-data.js");

const site = {
  name: "miolo",
  title: "miolo",
  description: "Conteudo visual para gastronomia, produto e hospitalidade.",
  proposition:
    "Conteudo visual para gastronomia, produto e hospitalidade. A Miolo transforma o acervo autoral e comercial em um portfólio de estúdio, com recortes claros, galerias completas e contato direto para projetos.",
  about:
    "Miolo é um estúdio de conteúdo visual para gastronomia, produto e hospitalidade. A marca nasce para organizar imagem, direção visual e bancos de conteúdo em uma estrutura que faça sentido para o cliente: categorias objetivas, ensaios legíveis, navegação limpa e contato sem ruído.",
  founder:
    "Direcao criativa e fotografia por Bernardo Silva. A experiencia autoral do portfólio original continua presente, mas agora a apresentação responde como estúdio.",
  contact: {
    email: "baugustosilva@gmail.com",
    whatsappLabel: "+55 31 992-484-394",
    whatsappHref: "https://wa.me/5531992484394",
    instagramLabel: "@bbbernardo.silva",
    instagramHref: "https://instagram.com/bbbernardo.silva"
  },
  services: [
    {
      index: "01",
      title: "fotografia",
      text: "Ensaios para restaurantes, marcas e produtos com foco em presença, gesto e matéria."
    },
    {
      index: "02",
      title: "direcao visual",
      text: "Construção de linguagem, enquadramento, ritmo e atmosfera para campanhas e bancos de imagem."
    },
    {
      index: "03",
      title: "bancos de conteudo",
      text: "Produções recorrentes pensadas para alimentar site, imprensa, cardápio, social e materiais de marca."
    },
    {
      index: "04",
      title: "projetos editoriais",
      text: "Narrativas visuais para lancamentos, menus, colaborações, ambientes e presença de marca."
    }
  ],
  categories: {
    gastronomia: {
      slug: "gastronomia",
      title: "gastronomia",
      shortTitle: "gastro",
      description: "Restaurantes, cafes, cozinhas, menus, serviço e atmosfera.",
      intro:
        "O recorte de gastronomia reune restaurantes, cafes e cozinhas em ensaios que priorizam gesto, materia, calor e presenca de marca."
    },
    produto: {
      slug: "produto",
      shortTitle: "produto",
      title: "produto",
      description: "Objeto, superficie, textura, uso e campanha.",
      intro:
        "O recorte de produto organiza objetos, coleções e campanhas com leitura de materia, função e presença editorial."
    }
  }
};

const registry = [
  {
    folder: "20181111-Copa-Cozinha",
    slug: "20181111-copa-cozinha",
    title: "Copa Cozinha",
    year: "2018",
    category: "gastronomia",
    cover: "20181111-Copa-Cozinha-00006.webp",
    gridCover: "20181111-Copa-Cozinha-00006.webp",
    blurb: "cozinha, chama e servico"
  },
  {
    folder: "20191009-Curamagoa",
    slug: "20191009-curamagoa",
    title: "Curamagoa",
    year: "2019",
    category: "gastronomia",
    cover: "20191009-Curamagoa-7942031.webp",
    gridCover: "20191009-Curamagoa-7942031.webp",
    blurb: "ingrediente, bancada e preparo"
  },
  {
    folder: "20191204-Cozinha-da-Vo-Ana",
    slug: "20191204-cozinha-da-vo-ana",
    title: "Cozinha da Vo Ana",
    year: "2019",
    category: "gastronomia",
    cover: "20191204-Cozinha-da-Vo-Ana-0004.webp",
    gridCover: "20191204-Cozinha-da-Vo-Ana-0004.webp",
    blurb: "mesa, textura e intimidade"
  },
  {
    folder: "20200723-Forno-da-Saudade",
    slug: "20200723-forno-da-saudade",
    title: "Forno da Saudade",
    year: "2020",
    category: "gastronomia",
    cover: "20200723-Forno-da-Saudade-0011.webp",
    gridCover: "20200723-Forno-da-Saudade-0011.webp",
    blurb: "forno, massa e atmosfera"
  },
  {
    folder: "20210528-Capim-Rosa",
    slug: "20210528-capim-rosa",
    title: "Capim Rosa",
    year: "2021",
    category: "produto",
    cover: "20210528-Capim-Rosa-4856.webp",
    gridCover: "20210528-Capim-Rosa-4860.webp",
    blurb: "forma, superficie e uso"
  },
  {
    folder: "20210906-Tapecaria-Aveia",
    slug: "20210906-tapecaria-aveia",
    title: "Tapecaria Aveia",
    year: "2021",
    category: "produto",
    cover: "20210906-Tapecaria-Aveia-2148-cover.webp",
    gridCover: "20210906-Tapecaria-Aveia-2148.webp",
    blurb: "fibra, materia e detalhe"
  },
  {
    folder: "20211126-Capim-Rosa",
    slug: "20211126-capim-rosa",
    title: "Capim Rosa",
    year: "2021",
    category: "produto",
    cover: "20211126-Capim-Rosa-2656.webp",
    gridCover: "20211126-Capim-Rosa-2656.webp",
    blurb: "campanha, textura e gesto"
  },
  {
    folder: "20220901-Enquanto",
    slug: "20220901-enquanto",
    title: "Enquanto",
    year: "2022",
    category: "produto",
    cover: "20220901-Enquanto-0446-cover.webp",
    gridCover: "20220901-Enquanto0446.webp",
    blurb: "objeto, tecido e presenca"
  },
  {
    folder: "20230613-Juramento-202",
    slug: "20230613-juramento-202",
    title: "Juramento 202",
    year: "2023",
    category: "gastronomia",
    cover: "20230613-Juramento-202-2626.webp",
    gridCover: "20230613-Juramento-202-2626.webp",
    blurb: "bar, cena e encontro"
  },
  {
    folder: "20230807-Tapecaria-Aveia",
    slug: "20230807-tapecaria-aveia",
    title: "Tapecaria Aveia",
    year: "2023",
    category: "produto",
    cover: "20230807-Tapecaria-Aveia-3287.webp",
    gridCover: "20230807-Tapecaria-Aveia-3258.webp",
    blurb: "textura, trama e objeto"
  },
  {
    folder: "20231006-Distribuidora-Goitacazes",
    slug: "20231006-distribuidora-goitacazes",
    title: "Distribuidora Goitacazes",
    year: "2023",
    category: "gastronomia",
    cover: "20231006-Distribuidora-Goitacazes-4529.webp",
    gridCover: "20231006-Distribuidora-Goitacazes-4529.webp",
    blurb: "estoque, servico e ritmo"
  },
  {
    folder: "20231207-Cozinha-Tupis",
    slug: "20231207-cozinha-tupis",
    title: "Cozinha Tupis",
    year: "2023",
    category: "gastronomia",
    cover: "20231207-Cozinha-Tupis-5865.webp",
    gridCover: "20231207-Cozinha-Tupis-5865.webp",
    blurb: "cozinha, calor e processo"
  },
  {
    folder: "20240228-Casinha-do-Jura",
    slug: "20240228-casinha-do-jura",
    title: "Casinha do Jura",
    year: "2024",
    category: "gastronomia",
    cover: "20240228-Casinha-do-Jura-7006.webp",
    gridCover: "20240228-Casinha-do-Jura.webp",
    blurb: "casa, alimento e presenca"
  },
  {
    folder: "20240404-Juramento-202",
    slug: "20240404-juramento-202",
    title: "Juramento 202",
    year: "2024",
    category: "gastronomia",
    cover: "20240404-Juramento-202-8679.webp",
    gridCover: "20240404-Juramento-202-8679.webp",
    blurb: "bar, luz e ambiencia"
  },
  {
    folder: "20240418-Tapecaria-Aveia",
    slug: "20240418-tapecaria-aveia",
    title: "Tapecaria Aveia",
    year: "2024",
    category: "produto",
    cover: "20240418-Tapecaria-Aveia-9813.webp",
    gridCover: "20240418-Tapecaria-Aveia-9927.webp",
    blurb: "superficie, forma e tato"
  },
  {
    folder: "20240427-Copa-Cozinha",
    slug: "20240427-copa-cozinha",
    title: "Copa Cozinha",
    year: "2024",
    category: "gastronomia",
    cover: "20240427-Copa-Cozinha-0800.webp",
    gridCover: "20240427-Copa-Cozinha-0800.webp",
    blurb: "fogo, massa e energia"
  },
  {
    folder: "20241022-Casa-Gabo",
    slug: "20241022-casa-gabo",
    title: "Casa Gabo",
    year: "2024",
    category: "gastronomia",
    cover: "20241022-Casa-Gabo-126.webp",
    gridCover: "20241022-Casa-Gabo-126.webp",
    blurb: "casa, recepcao e mesa"
  },
  {
    folder: "20241106-Cozinha-Tupis",
    slug: "20241106-cozinha-tupis",
    title: "Cozinha Tupis",
    year: "2024",
    category: "gastronomia",
    cover: "20241106-Cozinha-Tupis-0612.webp",
    gridCover: "20241106-Cozinha-Tupis-0612.webp",
    blurb: "brigada, servico e prato"
  },
  {
    folder: "20250724-Forno-da-Saudade",
    slug: "20250724-forno-da-saudade",
    title: "Forno da Saudade",
    year: "2025",
    category: "gastronomia",
    cover: "20250724-Forno-da-Saudade-4993.webp",
    gridCover: "20250724-Forno-da-Saudade-5044.webp",
    blurb: "mesa, forno e encontro"
  },
  {
    folder: "20250819-Regina-Misk",
    slug: "20250819-regina-misk",
    title: "Regina Misk",
    year: "2025",
    category: "produto",
    cover: "20250819-Regina-Misk-6282.webp",
    gridCover: "20250819-Regina-Misk-6282.webp",
    blurb: "lifestyle, objeto e campanha"
  },
  {
    folder: "20250918-Cafe-Nice",
    slug: "20250918-cafe-nice",
    title: "Cafe Nice",
    year: "2025",
    category: "gastronomia",
    cover: "20250918-Cafe-Nice-7921.webp",
    gridCover: "20250918-Cafe-Nice-7921.webp",
    blurb: "cafe, textura e rotina"
  },
  {
    folder: "20251009-Hacienda-1979",
    slug: "20251009-hacienda-1979",
    title: "Hacienda 1979",
    year: "2025",
    category: "gastronomia",
    cover: "20251009-Hacienda-1979-8304.webp",
    gridCover: "20251009-Hacienda-1979-8304.webp",
    blurb: "ambiente, menu e atmosfera"
  },
  {
    folder: "20251021-Cozinha-Tupis",
    slug: "20251021-cozinha-tupis",
    title: "Cozinha Tupis",
    year: "2025",
    category: "gastronomia",
    cover: "20251021-Cozinha-Tupis-8971.webp",
    gridCover: "20251021-Cozinha-Tupis-8971.webp",
    blurb: "brigada, calor e fluxo"
  },
  {
    folder: "20251114-Copa-Cozinha",
    slug: "20251114-copa-cozinha",
    title: "Copa Cozinha",
    year: "2025",
    category: "gastronomia",
    cover: "20251114-Copa-Cozinha-0410.webp",
    gridCover: "20251114-Copa-Cozinha-0410.webp",
    blurb: "servico, cozinha e ritmo"
  }
];

const selectedHome = {
  gastronomia: [
    "20250918-cafe-nice",
    "20241022-casa-gabo",
    "20250724-forno-da-saudade",
    "20241106-cozinha-tupis"
  ],
  produto: [
    "20250819-regina-misk",
    "20220901-enquanto",
    "20240418-tapecaria-aveia",
    "20210528-capim-rosa"
  ]
};

function readImages(folder) {
  const target = path.join(imgDir, folder);
  return fs
    .readdirSync(target)
    .filter((file) => /\.(webp|jpg|jpeg|png)$/i.test(file))
    .filter((file) => !file.endsWith("-cover.webp"))
    .filter((file) => !file.startsWith("."))
    .sort((left, right) => left.localeCompare(right, "pt-BR", { numeric: true }));
}

function publicImagePath(folder, file) {
  return `img/${folder}/${file}`;
}

function gridImagePath(file) {
  return `img/grid/${file}`;
}

function escapeHtml(text) {
  return String(text)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

const essays = registry.map((entry) => {
  const images = readImages(entry.folder);
  const preferredCover = images.includes(entry.cover) ? publicImagePath(entry.folder, entry.cover) : images.length ? publicImagePath(entry.folder, images[0]) : gridImagePath(entry.gridCover);
  const heroCover = fs.existsSync(path.join(imgDir, "grid", entry.gridCover)) ? gridImagePath(entry.gridCover) : preferredCover;

  return {
    ...entry,
    categoryTitle: site.categories[entry.category].title,
    coverSrc: preferredCover,
    heroSrc: heroCover,
    imageCount: images.length,
    images: images.map((file) => publicImagePath(entry.folder, file))
  };
});

const publicCategories = Object.values(site.categories).map((category) => ({
  ...category,
  essayCount: essays.filter((essay) => essay.category === category.slug).length
}));

const dataPayload = {
  site,
  categories: publicCategories,
  essays,
  heroStrip: essays.map((essay) => ({
    src: essay.heroSrc,
    alt: `${essay.title} ${essay.year}`
  }))
};

function getPageMeta({ title, description, canonical, image }) {
  return `  <title>${escapeHtml(title)}</title>
  <meta name="description" content="${escapeHtml(description)}">
  <meta property="og:type" content="website">
  <meta property="og:site_name" content="${escapeHtml(site.name)}">
  <meta property="og:title" content="${escapeHtml(title)}">
  <meta property="og:description" content="${escapeHtml(description)}">
  <meta property="og:url" content="${escapeHtml(canonical)}">
  <meta property="og:image" content="${escapeHtml(image)}">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${escapeHtml(title)}">
  <meta name="twitter:description" content="${escapeHtml(description)}">
  <meta name="twitter:image" content="${escapeHtml(image)}">`;
}

function nav(relativeRoot, current) {
  const items = [
    { href: `${relativeRoot}index.html`, label: "home", key: "home" },
    { href: `${relativeRoot}categorias/gastronomia/index.html`, label: "gastronomia", key: "gastronomia" },
    { href: `${relativeRoot}categorias/produto/index.html`, label: "produto", key: "produto" },
    { href: `${relativeRoot}about/index.html`, label: "sobre", key: "sobre" },
    { href: `${relativeRoot}about/index.html#contato`, label: "contato", key: "contato" }
  ];

  return items
    .map((item) => `<a href="${item.href}"${item.key === current ? ' aria-current="page"' : ""}>${item.label}</a>`)
    .join("");
}

function header(relativeRoot, current) {
  return `<header class="site-header">
    <div class="site-header__inner">
      <a class="site-brand" href="${relativeRoot}index.html" aria-label="Miolo home">
        <img src="${relativeRoot}img/brand/marca-p-clean.svg" alt="miolo">
        <span class="site-brand__meta">conteudo visual<br>para gastronomia e produto</span>
      </a>
      <nav class="site-nav" aria-label="Navegacao principal">
        ${nav(relativeRoot, current)}
      </nav>
    </div>
  </header>`;
}

function footer(relativeRoot, current) {
  return `<footer class="site-footer">
    <div class="site-footer__inner">
      <div class="site-footer__meta">
        <div class="site-footer__eyebrow">miolo</div>
        <div class="site-footer__brand">conteudo visual para gastronomia, produto e hospitalidade.</div>
      </div>
      <nav class="site-footer__nav" aria-label="Navegacao de rodape">
        ${nav(relativeRoot, current)}
      </nav>
    </div>
  </footer>`;
}

function layout({ relativeRoot, current, title, description, canonical, image, bodyClass = "", main }) {
  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="robots" content="index,follow">
${getPageMeta({ title, description, canonical, image })}
  <link rel="icon" type="image/svg+xml" href="${relativeRoot}img/brand/miolo-symbol.svg">
  <link rel="stylesheet" href="${relativeRoot}assets/css/site.css">
</head>
<body class="${bodyClass}">
  ${header(relativeRoot, current)}
  ${main}
  ${footer(relativeRoot, current)}
  <script src="${relativeRoot}assets/js/site-data.js"></script>
  <script src="${relativeRoot}assets/js/site.js"></script>
</body>
</html>`;
}

function essayCard(essay, relativeRoot) {
  return `<article class="essay-card">
    <a class="essay-card__cover" href="${relativeRoot}ensaios/${essay.slug}/index.html">
      <img src="${relativeRoot}${essay.coverSrc}" alt="${escapeHtml(essay.title)} ${essay.year}">
    </a>
    <div class="essay-card__body">
      <div class="essay-card__meta">${essay.categoryTitle} · ${essay.year} · ${essay.imageCount} imagens</div>
      <h3 class="essay-card__title"><a href="${relativeRoot}ensaios/${essay.slug}/index.html">${essay.title}</a></h3>
      <p class="essay-card__description">${essay.blurb}</p>
    </div>
  </article>`;
}

function buildCategory(category) {
  const categoryEssays = essays.filter((essay) => essay.category === category.slug);
  const cards = categoryEssays.map((essay) => essayCard(essay, "../../")).join("");

  const main = `<main class="page-main">
    <section class="category-hero">
      <div class="category-hero__inner">
        <div class="page-hero__eyebrow">categoria</div>
        <h1 class="category-hero__title">${category.title}</h1>
        <p class="category-hero__text">${category.intro}</p>
        <div class="essay-meta">${categoryEssays.length} ensaios · recorte publico da miolo</div>
      </div>
    </section>
    <section class="section section--compact">
      <div class="section__inner">
        <div class="essay-list">
          ${cards}
        </div>
      </div>
    </section>
  </main>`;

  return layout({
    relativeRoot: "../../",
    current: category.slug,
    title: `miolo - ${category.title}`,
    description: category.description,
    canonical: `https://miolo.online/categorias/${category.slug}/`,
    image: `https://miolo.online/${categoryEssays[0].heroSrc}`,
    main
  });
}

function buildCategoryIndex() {
  const categoryCards = publicCategories
    .map((category) => {
      const featuredEssay = essays.find((essay) => essay.category === category.slug);
      return `<article class="category-card">
        <a class="category-card__cover" href="../categorias/${category.slug}/index.html">
          <img src="../${featuredEssay.coverSrc}" alt="${escapeHtml(category.title)}">
        </a>
        <div class="category-card__meta">${category.essayCount} ensaios disponiveis</div>
        <h2 class="category-card__title"><a href="../categorias/${category.slug}/index.html">${category.title}</a></h2>
        <p class="category-card__description">${category.description}</p>
      </article>`;
    })
    .join("");

  const main = `<main class="page-main">
    <section class="category-hero">
      <div class="category-hero__inner">
        <div class="page-hero__eyebrow">index</div>
        <h1 class="category-hero__title">categorias publicas.</h1>
        <p class="category-hero__text">A Miolo organiza o portfolio em recortes claros para leitura comercial. Hoje, a entrada publica acontece por gastronomia e produto.</p>
      </div>
    </section>
    <section class="section section--compact">
      <div class="section__inner">
        <div class="category-grid">
          ${categoryCards}
        </div>
      </div>
    </section>
  </main>`;

  return layout({
    relativeRoot: "../",
    current: "",
    title: "miolo - index",
    description: site.description,
    canonical: "https://miolo.online/categorias/",
    image: "https://miolo.online/img/brand/miolo-lockup.svg",
    main
  });
}

function buildAbout() {
  const selectedEssays = [
    ...selectedHome.gastronomia.map((slug) => essays.find((essay) => essay.slug === slug)),
    ...selectedHome.produto.map((slug) => essays.find((essay) => essay.slug === slug))
  ].filter(Boolean);

  const selectedGrid = selectedEssays.map((essay) => essayCard(essay, "../")).join("");

  const main = `<main class="page-main">
    <section class="category-hero">
      <div class="category-hero__inner">
        <div class="page-hero__eyebrow">sobre a miolo</div>
        <h1 class="category-hero__title">estrutura de estudio.</h1>
        <p class="category-hero__text">${site.about}</p>
        <div class="essay-meta">${site.founder}</div>
      </div>
    </section>

    <section class="section section--compact">
      <div class="section__inner">
        <div class="section__heading">
          <div class="section__eyebrow">frentes de atuacao</div>
          <h2 class="section__title">o que a miolo entrega.</h2>
        </div>
        <div class="services-grid">
          ${site.services
            .map(
              (service) => `<article class="service-item">
                <div class="service-item__index">${service.index}</div>
                <h3 class="service-item__title">${service.title}</h3>
                <p class="service-item__text">${service.text}</p>
              </article>`
            )
            .join("")}
        </div>
      </div>
    </section>

    <section class="section section--compact">
      <div class="section__inner">
        <div class="section__heading">
          <div class="section__eyebrow">recortes publicos</div>
          <h2 class="section__title">portfolio organizado por categoria.</h2>
          <p class="section__text">A Miolo parte do acervo comercial do Bernardo e o reorganiza em dois recortes claros para cliente agora: gastronomia e produto. Hospitalidade segue no posicionamento da marca e sobe quando o corpo de trabalho estiver consistente.</p>
        </div>
        <div class="essay-list">
          ${selectedGrid}
        </div>
      </div>
    </section>

    <section class="section" id="contato">
      <div class="section__inner">
        <div class="contact-panel">
          <div class="section__heading">
            <div class="section__eyebrow">contato</div>
            <h2 class="section__title">projetos, orcamentos e colaborações.</h2>
            <p class="contact-panel__text">Contato direto, sem intermediacao, com caminho curto para projeto, conversa e planejamento de conteudo.</p>
          </div>
          <div class="contact-panel__links">
            <a href="mailto:${site.contact.email}">${site.contact.email}</a>
            <a href="${site.contact.whatsappHref}" target="_blank" rel="noreferrer noopener">${site.contact.whatsappLabel}</a>
            <a href="${site.contact.instagramHref}" target="_blank" rel="noreferrer noopener">${site.contact.instagramLabel}</a>
          </div>
        </div>
      </div>
    </section>
  </main>`;

  return layout({
    relativeRoot: "../",
    current: "sobre",
    title: "miolo - sobre",
    description: site.description,
    canonical: "https://miolo.online/about/",
    image: "https://miolo.online/img/brand/miolo-lockup.svg",
    main
  });
}

function buildEssay(essay) {
  const category = site.categories[essay.category];
  const gallery = essay.images
    .map(
      (image, index) => `<figure>
        <img src="../../${image}" alt="${escapeHtml(essay.title)} ${index + 1}">
      </figure>`
    )
    .join("");

  const main = `<main class="page-main">
    <section class="essay-hero">
      <div class="essay-hero__inner">
        <div class="page-hero__eyebrow">${category.title} · ${essay.year}</div>
        <h1 class="essay-hero__title">${essay.title}</h1>
        <p class="essay-hero__text">${essay.blurb}. ${essay.imageCount} imagens organizadas em um ensaio completo, com entrada direta para contato e leitura clara do projeto.</p>
        <div class="essay-meta"><a href="../../categorias/${essay.category}/index.html">${category.title}</a> · ${essay.year} · ${essay.imageCount} imagens</div>
        <div class="essay-hero__cover">
          <img src="../../${essay.coverSrc}" alt="${escapeHtml(essay.title)} ${essay.year}">
        </div>
      </div>
    </section>
    <section class="essay-gallery" data-lightbox>
      ${gallery}
    </section>
  </main>`;

  return layout({
    relativeRoot: "../../",
    current: essay.category,
    title: `miolo - ${essay.title} ${essay.year}`,
    description: `${essay.title}, ${essay.year}. ${essay.blurb}.`,
    canonical: `https://miolo.online/ensaios/${essay.slug}/`,
    image: `https://miolo.online/${essay.coverSrc}`,
    bodyClass: "page-essay",
    main
  });
}

function writeFile(target, content) {
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, content, "utf8");
}

writeFile(outputDataFile, `window.MIOLO_DATA = ${JSON.stringify(dataPayload, null, 2)};\n`);

for (const category of publicCategories) {
  writeFile(path.join(root, "categorias", category.slug, "index.html"), buildCategory(category));
}

writeFile(path.join(root, "categorias", "index.html"), buildCategoryIndex());
writeFile(path.join(root, "about", "index.html"), buildAbout());

for (const essay of essays) {
  writeFile(path.join(root, "ensaios", essay.slug, "index.html"), buildEssay(essay));
}

console.log(`Build concluido: ${essays.length} ensaios publicados localmente.`);
