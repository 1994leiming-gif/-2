import allProducts from './data/all-products.js';
import { t, getLanguage, escapeHtml as esc, number, languageSwitch } from './i18n.js';
import { categoryPath, productPath, normalizeLocalPath, entityFromLocation, canonicalUrl, languageCodes, localeDetails } from './seo-routes.js';

export const supplierUrl = 'https://luzhouspecialty.m.en.alibaba.com/';
export const categories = ['paperbag','nonwoven','paperbox','mailerbox','flexiblepack','accessory','plasticbag'];
export const paperIds = ['1601899947431','1601929692010','1601929766011','1601925253800','1601927631424','1601925527548'];
export const imagePath = item => item.localImage || item.image;
export function route(path) {
  return normalizeLocalPath(path, getLanguage());
}
export function productTitle(item) {
  const curated = paperIds.indexOf(item.id);
  if (curated !== -1) return t('paper' + (curated + 1));
  // Use source-title features, not the old generic Chinese marketing names.
  const features = featureRules.filter(([,pattern])=>pattern.test(item.subject)).map(([key])=>t(key));
  return [t(item.category),...features.slice(0,2)].join(' · ');
}
const featureRules = [
  ['tagPlaPbat',/PLA\s*\+\s*PBAT/i],['tagBopp',/\bBOPP\b/i],['tagPe',/\bPE\b/i],
  ['tagKraft',/kraft/i],['tagBoard',/cardstock|paperboard|cardboard/i],['tagCoated',/coated paper|art paper/i],
  ['tagNonwoven',/non[ -]?woven/i],['tagCotton',/cotton (rope|handle)/i],
  ['tagRibbon',/ribbon/i],['tagTwisted',/twisted (handle|rope)/i],['tagFoil',/gold foil|foil stamp/i],
  ['tagUv',/\buv\b/i],['tagLaminated',/laminat/i],['tagFood',/food|bakery|coffee|tea\b/i],
  ['tagGift',/gift|jewelry/i],['tagShopping',/shopping|retail|boutique/i],['tagZipper',/zipper|resealable/i],
  ['tagCorrugated',/corrugated/i],['tagEmbossed',/emboss/i],['tagScreen',/screen print/i],['tagOffset',/offset/i],['tagGravure',/gravure|intaglio/i],
  ['tagRecycled',/recyclable/i],['tagReusable',/reusable/i],['tagCustom',/custom/i]
];
export function productSummary(item, limit = Infinity) {
  return featureRules.filter(([,pattern]) => pattern.test(item.subject)).map(([key]) => t(key)).slice(0, limit).join(' · ') || t(item.category);
}
export function productSeoTitle(item) {
  const fullName = productTitle(item);
  const firstFeature = featureRules.find(([,pattern]) => pattern.test(item.subject));
  const categoryName = t(item.category);
  const candidates = [fullName, firstFeature ? categoryName + ' · ' + t(firstFeature[0]) : categoryName, categoryName];
  const titles = candidates.map(name => t('productPageTitle',{name:name + ' · #' + item.id}));
  return titles.find(title => title.length <= 75) || titles.at(-1);
}
export function productSeoDescription(item) {
  return [productSummary(item, 3),t('moq')+': '+moq(item),t('productId')+': '+item.id].join('. ');
}
const unitKeys = {piece:'unitPiece',pieces:'unitPieces',roll:'unitRoll',rolls:'unitRolls',kilogram:'unitKilogram',kilograms:'unitKilogram','square meter':'unitSquareMeter','square meters':'unitSquareMeter',kilometer:'unitKilometer',kilometers:'unitKilometer'};
export function moq(item) {
  const match = item.moq.match(/^([\d,.]+)\s+(.+)$/);
  return match && unitKeys[match[2]] ? number(Number(match[1].replaceAll(',',''))) + ' ' + t(unitKeys[match[2]]) : t('pending');
}
export const productUnit = item => unitKeys[item.price.split('/').at(-1).trim()] ? t(unitKeys[item.price.split('/').at(-1).trim()]) : t('pending');
export const checkedDate = item => new Intl.DateTimeFormat({zh:'zh-CN',en:'en-US',ar:'ar'}[getLanguage()],{year:'numeric',month:'short',day:'numeric',timeZone:'UTC'}).format(new Date(item.sourceCheckedAt+'T00:00:00Z'));
export function price(item) {
  // "Other" in source data does not identify a currency. Never relabel it as USD.
  const match = item.price.match(/^\$([\d.]+)(?:-([\d.]+))?\s*\/\s*(.+)$/);
  if (!match || item.sourceCurrency !== 'USD' || !unitKeys[match[3]]) return t('priceAsk');
  const format = value => new Intl.NumberFormat({zh:'zh-CN',en:'en-US',ar:'ar'}[getLanguage()], {style:'currency',currency:'USD'}).format(Number(value));
  return t('pricePer',{price:format(match[1]) + (match[2] ? ' – ' + format(match[2]) : ''),unit:t(unitKeys[match[3]])});
}
export function wordmark(href = '/') {
  return '<a class="brand source-wordmark" href="' + esc(href) + '" aria-label="' + t('home') + '"><img src="/images/lu-packaging-horizontal.png" alt="LU Packaging"></a>';
}
export function productMenu() {
  const categoryGroups = categories.map(category => {
    const products = allProducts.filter(item => item.category === category);
    return '<section class="product-menu-group" data-product-group>' +
      '<div class="product-menu-group-head"><a href="' + categoryLink(category) + '">' + esc(t(category)) + '</a><span>' + number(products.length) + '</span></div>' +
      '<div class="product-menu-links">' + products.map(item =>
        '<a href="' + productLink(item) + '" data-product-entry data-product-search="' + esc((productTitle(item) + ' ' + item.id).toLocaleLowerCase()) + '">' +
          '<span>' + esc(productTitle(item)) + '</span><small dir="ltr">#' + esc(item.id) + '</small></a>'
      ).join('') + '</div></section>';
  }).join('');
  return '<details class="product-nav-dropdown"><summary aria-label="' + esc(t('allProducts')) + '"><span>' + esc(t('allProducts')) + '</span><span class="product-menu-chevron" aria-hidden="true">⌄</span></summary>' +
    '<div class="product-menu-panel"><div class="product-menu-top"><a class="product-menu-featured" href="' + route('/products/featured/') + '">' + esc(t('allProducts')) + '</a>' +
      '<a class="product-menu-view-all" href="' + categoryLink('all') + '">' + esc(t('viewAll',{count:number(allProducts.length)})) + ' <span class="direction-arrow">→</span></a></div>' +
      '<label class="product-menu-search"><span>' + esc(t('productSearch')) + '</span><input type="search" inputmode="search" autocomplete="off" placeholder="' + esc(t('productSearch')) + '" data-product-menu-search></label>' +
      '<div class="product-menu-groups">' + categoryGroups + '</div><p class="product-menu-empty" data-product-menu-empty hidden>' + esc(t('productSearchEmpty')) + '</p></div></details>';
}
export function initProductMenu(root = document) {
  const dropdown = root.querySelector('.product-nav-dropdown');
  if (!dropdown) return;
  const input = dropdown.querySelector('[data-product-menu-search]');
  const groups = [...dropdown.querySelectorAll('[data-product-group]')];
  const entries = [...dropdown.querySelectorAll('[data-product-entry]')];
  const empty = dropdown.querySelector('[data-product-menu-empty]');
  const filter = () => {
    const query = input.value.trim().toLocaleLowerCase();
    let matches = 0;
    for (const entry of entries) {
      const visible = !query || entry.dataset.productSearch.includes(query);
      entry.hidden = !visible;
      if (visible) matches++;
    }
    for (const group of groups) group.hidden = ![...group.querySelectorAll('[data-product-entry]')].some(entry => !entry.hidden);
    empty.hidden = matches !== 0;
  };
  input.addEventListener('input', filter);
  dropdown.addEventListener('toggle', () => {
    if (!dropdown.open) return;
    root.querySelectorAll('.language-dropdown[open]').forEach(menu => menu.removeAttribute('open'));
  });
  root.addEventListener('click', event => {
    if (!dropdown.contains(event.target)) dropdown.removeAttribute('open');
  });
  root.addEventListener('keydown', event => {
    if (event.key !== 'Escape' || !dropdown.open) return;
    dropdown.removeAttribute('open');
    dropdown.querySelector('summary')?.focus({preventScroll:true});
  });
}
export function detailHeader(back = '/#papers', key = 'backCatalog') {
  return '<header class="detail-header">' + wordmark(route('/')) + '<a class="detail-back" href="' + esc(route(back)) + '" aria-label="' + t(key) + '"><span class="direction-arrow">←</span> ' + t(key) + '</a>' + languageSwitch() + '</header>';
}
export const footer = () => '<footer class="detail-footer">' + t('rights') + '</footer>';
export function metadata(title, description = t('metaHome')) {
  document.title = title;
  document.querySelector('meta[name="description"]')?.setAttribute('content', description);
  const entity = entityFromLocation();
  const canonical = canonicalUrl(entity, getLanguage());
  let canonicalLink = document.querySelector('link[rel="canonical"]');
  if (!canonicalLink) {
    canonicalLink = document.createElement('link');
    canonicalLink.rel = 'canonical';
    document.head.append(canonicalLink);
  }
  canonicalLink.href = canonical;
  document.querySelectorAll('link[rel="alternate"][hreflang]').forEach(link => link.remove());
  for (const language of languageCodes) {
    const link = document.createElement('link');
    link.rel = 'alternate';
    link.hreflang = localeDetails[language].tag;
    link.href = canonicalUrl(entity, language);
    document.head.append(link);
  }
  const fallback = document.createElement('link');
  fallback.rel = 'alternate';
  fallback.hreflang = 'x-default';
  fallback.href = canonicalUrl(entity, 'zh');
  document.head.append(fallback);
}
export function formStatus(status, message) {
  if (!status) return t('formHint');
  return '<span>' + esc(t(status === 'copied' ? 'copied' : 'manualCopy')) + '</span>' +
    (status === 'manual' ? '<pre class="inquiry-message" dir="auto">' + esc(message) + '</pre>' : '') +
    ' <a href="' + supplierUrl + '" target="_blank" rel="noopener">' + t('supplierChat') + ' ↗</a>';
}
export async function copyMessage(message) {
  try { await navigator.clipboard.writeText(message); return 'copied'; } catch { return 'manual'; }
}
export function emailError(input, required = false) {
  if (required && !input.value.trim()) return 'emailRequired';
  return input.validity.typeMismatch ? 'emailInvalid' : '';
}
export function parseColor(value) {
  if (!value || !/^\d{1,3}-\d{1,3}-\d{1,3}$/.test(value)) return null;
  const [h,s,l] = value.split('-').map(Number);
  return h <= 360 && s <= 100 && l <= 100 ? {h,s,l} : null;
}
export function productLink(item, color) {
  const path = productPath(item.id, getLanguage());
  return path + (color ? '?color=' + [color.h,color.s,color.l].join('-') : '');
}
export const categoryLink = (category = 'all', color) => categoryPath(category, getLanguage()) + (color ? '?color=' + [color.h,color.s,color.l].join('-') : '');
export const totalProducts = allProducts.length;
