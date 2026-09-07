import allProducts from './data/all-products.js';
import { t, getLanguage, escapeHtml as esc, number, languageSwitch } from './i18n.js';

export const supplierUrl = 'https://luzhouspecialty.m.en.alibaba.com/';
export const categories = ['paperbag','nonwoven','paperbox','mailerbox','flexiblepack','accessory','plasticbag'];
export const paperIds = ['1601899947431','1601929692010','1601929766011','1601925253800','1601927631424','1601925527548'];
export const imagePath = item => item.localImage || item.image;
export function route(path) {
  const url = new URL(path, location.origin);
  url.searchParams.set('lang', getLanguage());
  return url.pathname + url.search + url.hash;
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
export function productSummary(item) {
  return featureRules.filter(([,pattern]) => pattern.test(item.subject)).map(([key]) => t(key)).join(' · ') || t(item.category);
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
  return '<a class="brand source-wordmark" href="' + esc(href) + '" aria-label="' + t('home') + '"><span lang="en" dir="ltr">luzhou</span><span lang="en" dir="ltr">packaging</span></a>';
}
export function detailHeader(back = '/#papers', key = 'backCatalog') {
  return '<header class="detail-header">' + wordmark(route('/')) + '<a class="detail-back" href="' + esc(route(back)) + '" aria-label="' + t(key) + '"><span class="direction-arrow">←</span> ' + t(key) + '</a>' + languageSwitch() + '</header>';
}
export const footer = () => '<footer class="detail-footer">' + t('rights') + '</footer>';
export function metadata(title, description = t('metaHome')) {
  document.title = title;
  document.querySelector('meta[name="description"]')?.setAttribute('content', description);
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
  return route('/product.html?id=' + encodeURIComponent(item.id) + (color ? '&color=' + [color.h,color.s,color.l].join('-') : ''));
}
export const totalProducts = allProducts.length;
