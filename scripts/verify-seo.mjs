import { readFile, stat } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import allProducts from '../src/data/all-products.js';
import { categoryPath, homePath, languageCodes, localeDetails, productPath, siteUrl } from '../src/seo-routes.js';

const root = fileURLToPath(new URL('../dist/', import.meta.url));
const categories = ['all','paperbag','nonwoven','paperbox','mailerbox','flexiblepack','accessory','plasticbag'];
const failures = [];
let checked = 0;

const outputPath = pathname => join(root, pathname === '/' ? 'index.html' : pathname.replace(/^\/+|\/+$/g, '') + '/index.html');
const capture = (html, pattern) => html.match(pattern)?.[1];
const canonicalFor = path => siteUrl + path;

function inspectHtml(html, language, path) {
  const expectedCanonical = canonicalFor(path);
  const title = capture(html, /<title>([^<]+)<\/title>/);
  const description = capture(html, /<meta name="description" content="([^"]+)">/);
  const canonical = capture(html, /<link rel="canonical" href="([^"]+)">/);
  const hreflangs = [...html.matchAll(/<link rel="alternate" hreflang="([^"]+)" href="([^"]+)">/g)];
  const json = capture(html, /<script type="application\/ld\+json">([\s\S]+?)<\/script>/);
  if (!html.includes(`<html lang="${localeDetails[language].tag}" dir="${language === 'ar' ? 'rtl' : 'ltr'}">`)) failures.push(path + ': wrong html language/direction');
  const minimumTitle = language === 'zh' ? 4 : 8;
  const minimumDescription = language === 'zh' ? 10 : 30;
  if (!title || title.length < minimumTitle) failures.push(path + ': missing/short title');
  if (!description || description.length < minimumDescription) failures.push(path + ': missing/short description');
  if (canonical !== expectedCanonical) failures.push(path + ': canonical=' + canonical);
  if (hreflangs.length !== 11) failures.push(path + ': hreflang count=' + hreflangs.length);
  if (!html.includes('<meta name="robots" content="index,follow,max-image-preview:large">')) failures.push(path + ': wrong robots');
  if (!html.includes('<meta property="og:title"') || !html.includes('<meta name="twitter:card"')) failures.push(path + ': social metadata missing');
  if (!html.includes('<h1>')) failures.push(path + ': initial h1 missing');
  if (/href="[^"]*(?:\?lang=|category\.html\?type=|product\.html\?id=)/.test(html)) failures.push(path + ': legacy internal link');
  try { JSON.parse(json); } catch { failures.push(path + ': invalid JSON-LD'); }
  checked++;
  return title;
}

for (const language of languageCodes) {
  const titles = new Set();
  const paths = [
    homePath(language),
    ...categories.map(category => categoryPath(category, language)),
    ...allProducts.map(item => productPath(item.id, language)),
  ];
  for (const path of paths) {
    let html;
    try { html = await readFile(outputPath(path), 'utf8'); }
    catch { failures.push(path + ': file missing'); continue; }
    const title = inspectHtml(html, language, path);
    if (titles.has(title)) failures.push(path + ': duplicate title=' + title);
    titles.add(title);
  }
  const sitemap = await readFile(join(root, 'sitemaps', language + '.xml'), 'utf8');
  const urlCount = (sitemap.match(/<url>/g) || []).length;
  if (urlCount !== 287) failures.push(language + ' sitemap: URL count=' + urlCount);
  for (const path of paths) if (!sitemap.includes('<loc>' + canonicalFor(path) + '</loc>')) failures.push(language + ' sitemap missing ' + path);
}

const index = await readFile(join(root, 'sitemap.xml'), 'utf8');
if ((index.match(/<sitemap>/g) || []).length !== 10) failures.push('sitemap index must contain 10 sitemaps');
const robots = await readFile(join(root, 'robots.txt'), 'utf8');
if (!robots.includes('Sitemap: ' + siteUrl + '/sitemap.xml')) failures.push('robots.txt sitemap missing');
for (const asset of ['images/lu-packaging-horizontal.png','images/hero-packaging-source.webp','src/main.js','404.html']) {
  try { await stat(join(root, asset)); } catch { failures.push('missing output asset: ' + asset); }
}

if (checked !== 2870) failures.push('HTML page count checked=' + checked);
if (failures.length) {
  console.error('SEO verification failed:\n' + failures.slice(0, 100).join('\n'));
  if (failures.length > 100) console.error('…and ' + (failures.length - 100) + ' more');
  process.exit(1);
}
console.log(`SEO verification passed: ${checked} HTML pages, 10 × 287 sitemap URLs, unique localized titles, canonical/hreflang/JSON-LD/social metadata and crawl assets.`);
