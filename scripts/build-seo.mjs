import { cp, mkdir, readFile, readdir, rm, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import allProducts from '../src/data/all-products.js';
import { contentPageSlugs, getContentPage } from '../src/content-pages.js';
import { messages } from '../src/locales/index.js';
import { canonicalUrl, categoryPath, contentPath, homePath, languageCodes, localeDetails, productPath, siteUrl } from '../src/seo-routes.js';

const projectRoot = fileURLToPath(new URL('../', import.meta.url));
const outputRoot = join(projectRoot, 'dist');
const categories = ['paperbag','nonwoven','paperbox','mailerbox','flexiblepack','accessory','plasticbag'];
const paperIds = ['1601899947431','1601929692010','1601929766011','1601925253800','1601927631424','1601925527548'];
const buildDate = '2026-09-07';
const supplierUrl = 'https://luzhouspecialty.m.en.alibaba.com/';
const googleAnalyticsId = 'G-KJEG3N7QN4';
let assetVersion = 'dev';

const featureRules = [
  ['tagPlaPbat',/PLA\s*\+\s*PBAT/i],['tagBopp',/\bBOPP\b/i],['tagPe',/\bPE\b/i],
  ['tagKraft',/kraft/i],['tagBoard',/cardstock|paperboard|cardboard/i],['tagCoated',/coated paper|art paper/i],
  ['tagNonwoven',/non[ -]?woven/i],['tagCotton',/cotton (rope|handle)/i],
  ['tagRibbon',/ribbon/i],['tagTwisted',/twisted (handle|rope)/i],['tagFoil',/gold foil|foil stamp/i],
  ['tagUv',/\buv\b/i],['tagLaminated',/laminat/i],['tagFood',/food|bakery|coffee|tea\b/i],
  ['tagGift',/gift|jewelry/i],['tagShopping',/shopping|retail|boutique/i],['tagZipper',/zipper|resealable/i],
  ['tagCorrugated',/corrugated/i],['tagEmbossed',/emboss/i],['tagScreen',/screen print/i],
  ['tagOffset',/offset/i],['tagGravure',/gravure|intaglio/i],['tagRecycled',/recyclable/i],
  ['tagReusable',/reusable/i],['tagCustom',/custom/i],
];
const unitKeys = {piece:'unitPiece',pieces:'unitPieces',roll:'unitRoll',rolls:'unitRolls',kilogram:'unitKilogram',kilograms:'unitKilogram','square meter':'unitSquareMeter','square meters':'unitSquareMeter',kilometer:'unitKilometer',kilometers:'unitKilometer'};

const escapeHtml = value => String(value ?? '').replace(/[&<>"']/g, character => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[character]));
const escapeXml = escapeHtml;
const stripHtml = value => String(value).replace(/<br\s*\/?>/gi, ' ').replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
const translate = (language, key, values = {}) => {
  const value = messages[language]?.[key];
  if (value === undefined) throw new Error('Missing translation: ' + language + '/' + key);
  return value.replace(/\{(\w+)\}/g, (_, name) => String(values[name] ?? ''));
};
const localeNumber = (language, value) => new Intl.NumberFormat(localeDetails[language].tag).format(value);
const imageUrl = path => /^https?:/.test(path) ? path : siteUrl + path;
const productImage = item => item.localImage || item.image;
const assetPath = path => path.startsWith('/src/') ? '/assets/' + assetVersion + '/' + path.slice('/src/'.length) : path;

async function directoryHash(directory, hash = createHash('sha256')) {
  const entries = (await readdir(directory, {withFileTypes:true})).sort((a, b) => a.name.localeCompare(b.name));
  for (const entry of entries) {
    hash.update(entry.name + '\0');
    const path = join(directory, entry.name);
    if (entry.isDirectory()) await directoryHash(path, hash);
    else hash.update(await readFile(path));
  }
  return hash;
}

function productName(item, language) {
  const curated = paperIds.indexOf(item.id);
  if (curated !== -1) return translate(language, 'paper' + (curated + 1));
  const features = featureRules.filter(([, pattern]) => pattern.test(item.subject)).map(([key]) => translate(language, key));
  return [translate(language, item.category), ...features.slice(0, 2)].join(' · ');
}

function productSummary(item, language, limit = Infinity) {
  return featureRules.filter(([, pattern]) => pattern.test(item.subject)).map(([key]) => translate(language, key)).slice(0, limit).join(' · ') || translate(language, item.category);
}

function productSeoTitle(item, language) {
  const fullName = productName(item, language);
  const firstFeature = featureRules.find(([, pattern]) => pattern.test(item.subject));
  const categoryName = translate(language, item.category);
  const candidates = [fullName, firstFeature ? categoryName + ' · ' + translate(language, firstFeature[0]) : categoryName, categoryName];
  const titles = candidates.map(name => translate(language, 'productPageTitle', {name:name + ' · #' + item.id}));
  return titles.find(title => title.length <= 75) || titles.at(-1);
}

function localizedMoq(item, language) {
  const match = item.moq.match(/^([\d,.]+)\s+(.+)$/);
  return match && unitKeys[match[2]]
    ? localeNumber(language, Number(match[1].replaceAll(',', ''))) + ' ' + translate(language, unitKeys[match[2]])
    : translate(language, 'pending');
}

const entityPath = (entity, language) => entity.type === 'product'
  ? productPath(entity.id, language)
  : entity.type === 'category'
    ? categoryPath(entity.category, language)
    : entity.type === 'content'
      ? contentPath(entity.slug, language)
    : homePath(language);

function languageLinks(entity) {
  return languageCodes.map(language => '<link rel="alternate" hreflang="' + localeDetails[language].tag + '" href="' + canonicalUrl(entity, language) + '">').join('\n    ') +
    '\n    <link rel="alternate" hreflang="x-default" href="' + canonicalUrl(entity, 'en') + '">';
}

function jsonLd(data) {
  return JSON.stringify(data).replaceAll('<', '\\u003c');
}

function pageHead({ language, entity, title, description, image, type = 'website', schema, robots = 'index,follow,max-image-preview:large' }) {
  const canonical = canonicalUrl(entity, language);
  const alternates = languageCodes.filter(code => code !== language).map(code => '<meta property="og:locale:alternate" content="' + localeDetails[code].og + '">').join('\n    ');
  return `<meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${escapeHtml(title)}</title>
    <meta name="description" content="${escapeHtml(description)}">
    <meta name="robots" content="${robots}">
    <link rel="canonical" href="${canonical}">
    ${languageLinks(entity)}
    <meta property="og:type" content="${type}">
    <meta property="og:site_name" content="LU Packaging">
    <meta property="og:title" content="${escapeHtml(title)}">
    <meta property="og:description" content="${escapeHtml(description)}">
    <meta property="og:url" content="${canonical}">
    <meta property="og:locale" content="${localeDetails[language].og}">
    ${alternates}
    <meta property="og:image" content="${escapeHtml(image)}">
    <meta property="og:image:alt" content="${escapeHtml(title)}">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${escapeHtml(title)}">
    <meta name="twitter:description" content="${escapeHtml(description)}">
    <meta name="twitter:image" content="${escapeHtml(image)}">
    <link rel="icon" href="/images/lu-packaging-stacked.png" type="image/png">
    <link rel="apple-touch-icon" href="/images/lu-packaging-stacked.png">
    <link rel="stylesheet" href="${assetPath('/src/style.css')}">
    <!-- Google tag (gtag.js) -->
    <script async src="https://www.googletagmanager.com/gtag/js?id=${googleAnalyticsId}"></script>
    <script>
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', '${googleAnalyticsId}');
    </script>
    <script type="application/ld+json">${jsonLd(schema)}</script>`;
}

function htmlPage({ language, head, appId, bodyClass = '', fallback, script }) {
  const direction = language === 'ar' ? 'rtl' : 'ltr';
  return `<!doctype html>
<html lang="${localeDetails[language].tag}" dir="${direction}">
  <head>
    ${head}
  </head>
  <body${bodyClass ? ` class="${bodyClass}"` : ''}>
    <div id="${appId}">${fallback}</div>
    <script type="module" src="${assetPath(script)}"></script>
  </body>
</html>
`;
}

function breadcrumbSchema(items) {
  return {
    '@type':'BreadcrumbList',
    itemListElement:items.map((item, index) => ({'@type':'ListItem',position:index + 1,name:item.name,item:item.url})),
  };
}

function homeDocument(language) {
  const entity = {type:'home'};
  const title = stripHtml(translate(language, 'titleHome'));
  const description = stripHtml(translate(language, 'metaHome'));
  const url = canonicalUrl(entity, language);
  const schema = {'@context':'https://schema.org','@graph':[
    {'@type':'WebSite','@id':url + '#website',url,name:'LU Packaging',inLanguage:localeDetails[language].tag},
    {'@type':'Organization','@id':siteUrl + '/#organization',name:'LU Packaging',legalName:'泸州交通物流供应链管理有限公司',url:siteUrl,logo:imageUrl('/images/lu-packaging-stacked.png'),sameAs:[supplierUrl]},
  ]};
  const categoryLinks = categories.map(category => `<li><a href="${categoryPath(category, language)}">${escapeHtml(translate(language, category))}</a></li>`).join('');
  const fallback = `<header class="seo-fallback-header"><a href="${homePath(language)}"><img src="/images/lu-packaging-horizontal.png" alt="LU Packaging"></a></header><main class="seo-fallback"><h1>${translate(language, 'heroTitle')}</h1><p>${escapeHtml(description)}</p><h2>${escapeHtml(translate(language, 'catalog'))}</h2><ul>${categoryLinks}</ul><p>${escapeHtml(translate(language, 'companyIntro'))}</p></main>`;
  return htmlPage({language,head:pageHead({language,entity,title,description,image:imageUrl('/images/hero-packaging-source.webp'),schema}),appId:'app',fallback,script:'/src/main.js'});
}

function categoryDocument(language, category) {
  const entity = {type:'category',category};
  const categoryName = translate(language, category === 'all' ? 'allProducts' : category);
  const description = stripHtml(category === 'all'
    ? translate(language, 'allProducts') + ': ' + localeNumber(language, allProducts.length) + '. ' + translate(language, 'metaHome')
    : translate(language, category + 'Desc'));
  const title = stripHtml(translate(language, 'categoryTitle', {name:categoryName}));
  const products = category === 'all' ? allProducts : allProducts.filter(item => item.category === category);
  const url = canonicalUrl(entity, language);
  const schema = {'@context':'https://schema.org','@graph':[
    {'@type':'CollectionPage','@id':url + '#collection',url,name:title,description,inLanguage:localeDetails[language].tag,isPartOf:{'@id':canonicalUrl({type:'home'},language) + '#website'}},
    breadcrumbSchema([{name:translate(language, 'home'),url:canonicalUrl({type:'home'},language)},{name:categoryName,url}]),
  ]};
  const cards = products.slice(0, 24).map(item => `<article><a href="${productPath(item.id, language)}"><img src="${escapeHtml(productImage(item))}" alt="${escapeHtml(productName(item, language))}" loading="lazy"><h2>${escapeHtml(productName(item, language))}</h2></a><p>${escapeHtml(productSummary(item, language))}</p></article>`).join('');
  const fallback = `<nav class="seo-breadcrumb"><a href="${homePath(language)}">${escapeHtml(translate(language, 'home'))}</a> / <span>${escapeHtml(categoryName)}</span></nav><main class="seo-fallback"><h1>${escapeHtml(categoryName)}</h1><p>${escapeHtml(description)}</p><p>${localeNumber(language, products.length)} ${escapeHtml(translate(language, 'productCount'))}</p><section>${cards}</section></main>`;
  return htmlPage({language,head:pageHead({language,entity,title,description,image:imageUrl('/images/hero-packaging-source.webp'),schema}),appId:'category-app',bodyClass:'category-body',fallback,script:'/src/category.js'});
}

function productDocument(language, item) {
  const entity = {type:'product',id:item.id};
  const name = productName(item, language);
  const summary = stripHtml(productSummary(item, language));
  const title = stripHtml(productSeoTitle(item, language));
  const description = [productSummary(item, language, 3), translate(language, 'moq') + ': ' + localizedMoq(item, language), translate(language, 'productId') + ': ' + item.id].join('. ');
  const url = canonicalUrl(entity, language);
  const categoryName = translate(language, item.category);
  const schema = {'@context':'https://schema.org','@graph':[
    {'@type':'Product','@id':url + '#product',url,name,description:summary,image:[imageUrl(productImage(item))],sku:item.id,category:categoryName},
    breadcrumbSchema([
      {name:translate(language, 'home'),url:canonicalUrl({type:'home'},language)},
      {name:categoryName,url:canonicalUrl({type:'category',category:item.category},language)},
      {name,url},
    ]),
  ]};
  const fallback = `<nav class="seo-breadcrumb"><a href="${homePath(language)}">${escapeHtml(translate(language, 'home'))}</a> / <a href="${categoryPath(item.category, language)}">${escapeHtml(categoryName)}</a> / <span>${escapeHtml(name)}</span></nav><main class="seo-fallback"><article><img src="${escapeHtml(productImage(item))}" alt="${escapeHtml(name)}"><p>${escapeHtml(categoryName)}</p><h1>${escapeHtml(name)}</h1><p>${escapeHtml(summary)}</p><dl><dt>${escapeHtml(translate(language, 'productId'))}</dt><dd>${item.id}</dd><dt>${escapeHtml(translate(language, 'moq'))}</dt><dd>${escapeHtml(localizedMoq(item, language))}</dd></dl><a href="#inquiry">${escapeHtml(translate(language, 'productQuote'))}</a></article></main>`;
  return htmlPage({language,head:pageHead({language,entity,title,description,image:imageUrl(productImage(item)),type:'product',schema}),appId:'product-app',bodyClass:'detail-body',fallback,script:'/src/product.js'});
}

function contentDocument(language, slug) {
  const page = getContentPage(slug, language);
  const entity = {type:'content',slug};
  const url = canonicalUrl(entity, language);
  const title = stripHtml(page.title + ' | LU Packaging');
  const description = stripHtml(page.description);
  const schemaType = slug === 'company' ? 'AboutPage' : slug === 'products/featured' ? 'CollectionPage' : slug === 'request-quote' ? 'ContactPage' : 'WebPage';
  const schema = {'@context':'https://schema.org','@graph':[
    {'@type':schemaType,'@id':url + '#page',url,name:title,description,image:imageUrl(page.image),inLanguage:localeDetails[language].tag,isPartOf:{'@id':canonicalUrl({type:'home'},language) + '#website'}},
    breadcrumbSchema([{name:translate(language,'home'),url:canonicalUrl({type:'home'},language)},{name:page.title,url}]),
  ]};
  const points = page.points.map(point => `<li>${escapeHtml(point)}</li>`).join('');
  const fallback = `<nav class="seo-breadcrumb"><a href="${homePath(language)}">${escapeHtml(translate(language,'home'))}</a> / <span>${escapeHtml(page.title)}</span></nav><main class="seo-fallback"><article><p>${escapeHtml(page.eyebrow)}</p><h1>${escapeHtml(page.title)}</h1><p>${escapeHtml(description)}</p><img src="${escapeHtml(page.image)}" alt="${escapeHtml(page.imageAlt)}"><ul>${points}</ul><a href="${contentPath('request-quote',language)}">${escapeHtml(translate(language,'quote'))}</a></article></main>`;
  return htmlPage({language,head:pageHead({language,entity,title,description,image:imageUrl(page.image),schema}),appId:'content-app',bodyClass:'content-body',fallback,script:'/src/content.js'});
}

async function writePublic(pathname, contents) {
  const relative = pathname === '/' ? 'index.html' : join(pathname.replace(/^\/+|\/+$/g, ''), 'index.html');
  const target = join(outputRoot, relative);
  await mkdir(dirname(target), {recursive:true});
  await writeFile(target, contents);
}

function legacyDocument(appId, script, bodyClass = '') {
  const title = 'LU Packaging';
  const entity = {type:'home'};
  const schema = {'@context':'https://schema.org','@type':'WebSite',url:siteUrl,name:'LU Packaging'};
  return htmlPage({language:'zh',head:pageHead({language:'zh',entity,title,description:translate('zh','metaHome'),image:imageUrl('/images/hero-packaging-source.webp'),schema,robots:'noindex,follow'}),appId,bodyClass,fallback:'',script});
}

function sitemapEntry(entity, language, image) {
  const alternates = languageCodes.map(code => `    <xhtml:link rel="alternate" hreflang="${localeDetails[code].tag}" href="${escapeXml(canonicalUrl(entity, code))}"/>`).join('\n');
  return `  <url>\n    <loc>${escapeXml(canonicalUrl(entity, language))}</loc>\n    <lastmod>${buildDate}</lastmod>\n${alternates}\n    <xhtml:link rel="alternate" hreflang="x-default" href="${escapeXml(canonicalUrl(entity, 'en'))}"/>${image ? `\n    <image:image><image:loc>${escapeXml(imageUrl(image))}</image:loc></image:image>` : ''}\n  </url>`;
}

async function build() {
  assetVersion = (await directoryHash(join(projectRoot, 'src'))).digest('hex').slice(0, 12);
  await rm(outputRoot, {recursive:true,force:true});
  await mkdir(outputRoot, {recursive:true});
  for (const directory of ['catalog','company','fonts','images','public','src']) {
    await cp(join(projectRoot, directory), join(outputRoot, directory), {recursive:true});
  }
  for (const file of ['favicon.svg']) await cp(join(projectRoot, file), join(outputRoot, file));
  await cp(join(projectRoot, 'src'), join(outputRoot, 'assets', assetVersion), {recursive:true});
  await writeFile(join(outputRoot, 'asset-manifest.json'), JSON.stringify({version:assetVersion,base:'/assets/' + assetVersion}, null, 2) + '\n');

  for (const language of languageCodes) {
    await writePublic(homePath(language), homeDocument(language));
    for (const category of ['all', ...categories]) await writePublic(categoryPath(category, language), categoryDocument(language, category));
    for (const item of allProducts) await writePublic(productPath(item.id, language), productDocument(language, item));
    for (const slug of contentPageSlugs) await writePublic(contentPath(slug, language), contentDocument(language, slug));
  }

  // Root is an English alias with /en/ canonical. Preserve old Chinese deep links
  // as aliases with /zh/... canonical, so existing external links do not break.
  await writePublic('/', homeDocument('en'));
  for (const category of ['all', ...categories]) await writePublic('/categories/' + category + '/', categoryDocument('zh', category));
  for (const item of allProducts) await writePublic('/products/' + item.id + '/', productDocument('zh', item));
  for (const slug of contentPageSlugs) await writePublic('/' + slug + '/', contentDocument('zh', slug));

  await writeFile(join(outputRoot, 'category.html'), legacyDocument('category-app','/src/category.js','category-body'));
  await writeFile(join(outputRoot, 'product.html'), legacyDocument('product-app','/src/product.js','detail-body'));
  await writeFile(join(outputRoot, 'content.html'), legacyDocument('content-app','/src/content.js','content-body'));
  await writeFile(join(outputRoot, '404.html'), `<!doctype html><html lang="zh-CN"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width"><meta name="robots" content="noindex,follow"><title>404 | LU Packaging</title><link rel="stylesheet" href="${assetPath('/src/style.css')}"></head><body><main class="empty-product"><h1>404</h1><p>Page not found</p><a class="button" href="/">LU Packaging</a></main></body></html>\n`);

  await mkdir(join(outputRoot, 'sitemaps'), {recursive:true});
  for (const language of languageCodes) {
    const entries = [
      sitemapEntry({type:'home'}, language),
      ...['all', ...categories].map(category => sitemapEntry({type:'category',category}, language)),
      ...allProducts.map(item => sitemapEntry({type:'product',id:item.id}, language, productImage(item))),
      ...contentPageSlugs.map(slug => {
        const page = getContentPage(slug, language);
        return sitemapEntry({type:'content',slug}, language, page.image);
      }),
    ];
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n${entries.join('\n')}\n</urlset>\n`;
    await writeFile(join(outputRoot, 'sitemaps', language + '.xml'), sitemap);
  }
  const indexEntries = languageCodes.map(language => `  <sitemap><loc>${siteUrl}/sitemaps/${language}.xml</loc><lastmod>${buildDate}</lastmod></sitemap>`).join('\n');
  await writeFile(join(outputRoot, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${indexEntries}\n</sitemapindex>\n`);
  await writeFile(join(outputRoot, 'robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${siteUrl}/sitemap.xml\n`);
  console.log(`Generated ${languageCodes.length * (1 + 8 + allProducts.length + contentPageSlugs.length)} canonical HTML pages, ${languageCodes.length} language sitemaps, robots.txt, sitemap.xml and versioned assets ${assetVersion}.`);
}

await build();
