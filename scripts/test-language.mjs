import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { homePath, localizedCurrentPath } from '../src/seo-routes.js';

for (const [path, expected] of [['/', 'en'], ['/index.html', 'en'], ['/en/', 'en'], ['/zh/', 'zh'], ['/ar/', 'ar'], ['/fr/?lang=zh', 'fr'], ['/?lang=zh', 'zh'], ['/?lang=invalid', 'en'], ['/categories/paperbag/', 'zh']]) {
  globalThis.location = new URL(path, 'https://lu-packaging.com');
  const module = await import('../src/i18n.js?test=' + encodeURIComponent(path));
  assert.equal(module.getLanguage(), expected, path);
}
assert.equal(homePath('zh'), '/zh/');
assert.equal(localizedCurrentPath('en', new URL('https://lu-packaging.com/zh/products/123/?color=blue')), '/en/products/123/?color=blue');
assert.equal(localizedCurrentPath('zh', new URL('https://lu-packaging.com/en/')), '/zh/');
const root = await readFile(new URL('../dist/index.html', import.meta.url), 'utf8');
assert.match(root, /<html lang="en"/);
assert.match(root, /rel="canonical" href="https:\/\/lu-packaging.com\/en\/"/);
const zh = await readFile(new URL('../dist/zh/index.html', import.meta.url), 'utf8');
assert.match(zh, /<html lang="zh-CN"/);
const legacy = await readFile(new URL('../dist/categories/paperbag/index.html', import.meta.url), 'utf8');
assert.match(legacy, /rel="canonical" href="https:\/\/lu-packaging.com\/zh\/categories\/paperbag\/"/);
console.log('Language selection, explicit paths, root HTML and legacy URLs passed.');
