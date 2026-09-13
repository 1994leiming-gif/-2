import { messages } from './locales/index.js';
import { languageFromPath, localizedCurrentPath } from './seo-routes.js';

export const languageOptions = [
  { code:'en', tag:'en', flag:'🇬🇧', label:'English', short:'EN' },
  { code:'fr', tag:'fr-FR', flag:'🇫🇷', label:'Français', short:'FR' },
  { code:'de', tag:'de-DE', flag:'🇩🇪', label:'Deutsch', short:'DE' },
  { code:'es', tag:'es-ES', flag:'🇪🇸', label:'Español', short:'ES' },
  { code:'it', tag:'it-IT', flag:'🇮🇹', label:'Italiano', short:'IT' },
  { code:'ar', tag:'ar', flag:'🇸🇦', label:'العربية', short:'ع' },
  { code:'ru', tag:'ru-RU', flag:'🇷🇺', label:'Русский', short:'RU' },
  { code:'hi', tag:'hi-IN', flag:'🇮🇳', label:'हिन्दी', short:'हि' },
  { code:'id', tag:'id-ID', flag:'🇮🇩', label:'Bahasa Indonesia', short:'ID' },
  { code:'zh', tag:'zh-CN', flag:'🇨🇳', label:'中文', short:'中' },
];
export const languages = languageOptions.map(option => option.code);
const options = Object.fromEntries(languageOptions.map(option => [option.code, option]));
const tags = Object.fromEntries(languageOptions.map(option => [option.code, option.tag]));
const queryLanguage = new URLSearchParams(location.search).get('lang');
const pathLanguage = languageFromPath(location.pathname);
// Root is the international English entry. Keep legacy unprefixed deep links Chinese.
// Explicit locale URLs always win; IP/browser guesses must not override shared links.
const defaultLanguage = /^\/(?:index\.html)?$/.test(location.pathname) ? 'en' : 'zh';
let current = pathLanguage || (languages.includes(queryLanguage) ? queryLanguage : defaultLanguage);
export const getLanguage = () => current;
export const number = value => new Intl.NumberFormat(tags[current]).format(value);
export const escapeHtml = value => String(value ?? '').replace(/[&<>"']/g, c => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[c]));
export function t(key, values = {}) {
  if (!messages[current]?.[key]) throw new Error('Missing translation: ' + current + '/' + key);
  const result = messages[current][key];
  if (result === undefined) throw new Error('Missing locale: ' + current + '/' + key);
  return result.replace(/\{(\w+)\}/g, (_, name) => String(values[name] ?? ''));
}
export function languageSwitch() {
  const active = options[current];
  return '<details class="language-switch language-dropdown"><summary aria-label="' + escapeHtml(t('language')) + ': ' + escapeHtml(active.label) + '">' +
    '<span class="language-flag" aria-hidden="true">' + active.flag + '</span><span class="language-current">' + escapeHtml(active.short) + '</span><span class="language-chevron" aria-hidden="true">⌄</span></summary>' +
    '<div class="language-menu" role="menu" aria-label="' + escapeHtml(t('language')) + '">' + languageOptions.map(option =>
      '<button type="button" role="menuitemradio" data-lang="' + option.code + '" lang="' + option.tag + '" aria-checked="' + (current === option.code) + '" class="' + (current === option.code ? 'active' : '') + '">' +
      '<span class="language-flag" aria-hidden="true">' + option.flag + '</span><span>' + escapeHtml(option.label) + '</span><small>' + escapeHtml(option.short) + '</small></button>'
    ).join('') + '</div></details>';
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
    try { localStorage.setItem('site-language', button.dataset.lang); } catch {}
    location.assign(localizedCurrentPath(button.dataset.lang));
  });
  document.addEventListener('click', event => {
    document.querySelectorAll('.language-dropdown[open]').forEach(dropdown => {
      if (!dropdown.contains(event.target)) dropdown.removeAttribute('open');
    });
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') document.querySelectorAll('.language-dropdown[open]').forEach(dropdown => {
      dropdown.removeAttribute('open');
      dropdown.querySelector('summary')?.focus({ preventScroll:true });
    });
  });
  apply(current);
}
