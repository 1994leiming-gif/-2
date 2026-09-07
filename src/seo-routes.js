export const siteUrl = 'https://lu-packaging.com';
export const languageCodes = ['en','fr','de','es','it','ar','ru','hi','id','zh'];

export const localeDetails = {
  en:{tag:'en',og:'en_GB'}, fr:{tag:'fr-FR',og:'fr_FR'}, de:{tag:'de-DE',og:'de_DE'},
  es:{tag:'es-ES',og:'es_ES'}, it:{tag:'it-IT',og:'it_IT'}, ar:{tag:'ar',og:'ar_SA'},
  ru:{tag:'ru-RU',og:'ru_RU'}, hi:{tag:'hi-IN',og:'hi_IN'}, id:{tag:'id-ID',og:'id_ID'},
  zh:{tag:'zh-CN',og:'zh_CN'},
};

const prefix = language => language === 'zh' ? '' : '/' + language;
const normalized = path => path === '/' ? '/' : '/' + path.replace(/^\/+|\/+$/g, '') + '/';

export function languageFromPath(pathname) {
  const first = pathname.split('/').filter(Boolean)[0];
  return first && first !== 'zh' && languageCodes.includes(first) ? first : null;
}

export function withoutLanguage(pathname) {
  const language = languageFromPath(pathname);
  if (!language) return pathname;
  const rest = pathname.slice(language.length + 1);
  return rest || '/';
}

export const homePath = language => prefix(language) + '/';
export const categoryPath = (category, language) => prefix(language) + '/categories/' + encodeURIComponent(category || 'all') + '/';
export const productPath = (id, language) => prefix(language) + '/products/' + encodeURIComponent(id) + '/';

export function entityFromLocation(currentLocation = location) {
  const pathname = withoutLanguage(currentLocation.pathname);
  const params = currentLocation.searchParams || new URLSearchParams(currentLocation.search);
  const categoryMatch = pathname.match(/^\/categories\/([^/]+)\/?$/);
  const productMatch = pathname.match(/^\/products\/([^/]+)\/?$/);
  if (productMatch) return {type:'product',id:decodeURIComponent(productMatch[1])};
  if (categoryMatch) return {type:'category',category:decodeURIComponent(categoryMatch[1])};
  if (/\/product\.html$/.test(pathname)) return {type:'product',id:params.get('id') || ''};
  if (/\/category\.html$/.test(pathname)) return {type:'category',category:params.get('type') || 'all'};
  return {type:'home'};
}

export function entityPath(entity, language) {
  if (entity.type === 'product') return productPath(entity.id, language);
  if (entity.type === 'category') return categoryPath(entity.category, language);
  return homePath(language);
}

export function localizedCurrentPath(language, currentLocation = location) {
  const url = new URL(entityPath(entityFromLocation(currentLocation), language), currentLocation.origin);
  const color = currentLocation.searchParams?.get('color') || new URLSearchParams(currentLocation.search).get('color');
  if (color) url.searchParams.set('color', color);
  return url.pathname + url.search;
}

export function canonicalUrl(entity, language) {
  return siteUrl + entityPath(entity, language);
}

export function normalizeLocalPath(path, language) {
  const url = new URL(path, siteUrl);
  const entity = entityFromLocation(url);
  return entityPath(entity, language) + url.hash;
}

export { normalized };
