import { messages } from './locales.js';

export const languages = ['zh', 'en', 'ar'];
const tags = { zh:'zh-CN', en:'en', ar:'ar' };
const requested = new URLSearchParams(location.search).get('lang');
let current = languages.includes(requested) ? requested : 'zh';
try {
  const saved = localStorage.getItem('site-language');
  if (!languages.includes(requested) && languages.includes(saved)) current = saved;
} catch {}
export const getLanguage = () => current;
export const number = value => new Intl.NumberFormat(tags[current]).format(value);
export const escapeHtml = value => String(value ?? '').replace(/[&<>"']/g, c => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[c]));
export function t(key, values = {}) {
  if (!messages[key]) throw new Error('Missing translation: ' + key);
  const result = messages[key][languages.indexOf(current)];
  if (result === undefined) throw new Error('Missing locale: ' + current + '/' + key);
  return result.replace(/\{(\w+)\}/g, (_, name) => String(values[name] ?? ''));
}
export function languageSwitch() {
  return '<div class="language-switch" role="group" aria-label="' + t('language') + '">' +
    languages.map(lang => '<button type="button" data-lang="' + lang + '" lang="' + tags[lang] + '" aria-label="' +
      ({zh:'中文',en:'English',ar:'العربية'})[lang] + '" aria-pressed="' + (current === lang) + '" class="' +
      (current === lang ? 'active' : '') + '">' + ({zh:'中',en:'EN',ar:'ع'})[lang] + '</button>').join('') + '</div>';
}
export function initLanguage(render) {
  const apply = lang => {
    current = lang;
    try { localStorage.setItem('site-language', lang); } catch {}
    document.documentElement.lang = tags[lang];
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    const url = new URL(location.href);
    if (url.searchParams.has('lang')) {
      url.searchParams.set('lang', lang);
      history.replaceState(null, '', url);
    }
    render();
  };
  document.addEventListener('click', event => {
    const button = event.target.closest('button[data-lang]');
    if (!button || !languages.includes(button.dataset.lang) || button.dataset.lang === current) return;
    const y = window.scrollY;
    apply(button.dataset.lang);
    document.querySelector('button[data-lang="' + current + '"]')?.focus({ preventScroll:true });
    window.scrollTo({ top:y, behavior:'instant' });
  });
  window.addEventListener('storage', event => {
    if (event.key === 'site-language' && languages.includes(event.newValue) && event.newValue !== current) apply(event.newValue);
  });
  apply(current);
}
