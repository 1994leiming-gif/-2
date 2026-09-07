import allProducts from './data/all-products.js';
import {initLanguage,t,escapeHtml as esc,number} from './i18n.js';
import {categories,detailHeader,footer,metadata,productTitle,productSummary,imagePath,moq,price,route,productLink,parseColor,checkedDate} from './site.js';

const params=new URLSearchParams(location.search);
const requested=params.get('type');
const type=categories.includes(requested)?requested:'all';
const invalid=Boolean(requested&&requested!=='all'&&type==='all');
const products=type==='all'?allProducts:allProducts.filter(item=>item.category===type);
const color=parseColor(params.get('color'));
let shown=24;
function render(){
  const title=t(type==='all'?'allProducts':type);
  metadata(t('categoryTitle',{name:title}),type==='all'?t('metaHome'):t(type+'Desc'));
  document.querySelector('#category-app').innerHTML=`
  ${detailHeader()}
  <main class="category-main">
    <section class="category-hero ${color?'has-selected-color':''}" ${color?'style="--picked-color:hsl('+color.h+' '+color.s+'% '+color.l+'%)"':''}>
      <span>${t('catalog')}</span><h1>${title}</h1><p>${invalid?t('categoryInvalid'):type==='all'?t('metaHome'):t(type+'Desc')}</p>
      ${color?`<div class="picked-color-chip"><i></i><b>${t('selectedColor')}</b><small dir="ltr">H${color.h} S${color.s} L${color.l}</small></div><p>${t('colorReference')}</p>`:`<div><b>${number(products.length)}</b><small>${t('productCount')}</small></div>`}
      <p class="catalog-data-note">${t('catalogChecked',{date:checkedDate(allProducts[0])})} · ${t('priceNote')}</p>
    </section>
    <nav class="category-switch" aria-label="${t('categoryNav')}">
      ${['all',...categories].map(key=>`<a class="${key===type?'active':''}" aria-current="${key===type?'page':'false'}" href="${route('/category.html?type='+key+(color?'&color='+[color.h,color.s,color.l].join('-'):''))}"><span>${t(key==='all'?'allProducts':key)}</span><small>${number(key==='all'?allProducts.length:allProducts.filter(item=>item.category===key).length)}</small></a>`).join('')}
    </nav>
    <section class="category-products"><div class="category-grid" id="category-grid">
      ${products.slice(0,shown).map((item,i)=>`<a class="category-product" href="${productLink(item,color)}"><div><img src="${imagePath(item)}" alt="${esc(productTitle(item))}" loading="lazy"><span>${number(i+1)}</span></div><small>${t('moq')}: ${esc(moq(item))}</small><h2>${esc(productTitle(item))}</h2><p>${esc(productSummary(item))}</p><small class="catalog-product-id">${t('productId')} <bdi>${item.id}</bdi></small><b>${esc(price(item))}</b><i>${t('viewDetails')} ↗</i></a>`).join('')}
    </div>${!products.length?'<p>'+t('categoryEmpty')+'</p>':''}<button class="category-more" type="button" ${shown>=products.length?'hidden':''}>${t('categoryMore',{count:number(Math.max(0,products.length-shown))})} ↓</button></section>
  </main>${footer()}`;
  document.querySelector('.category-more').onclick=()=>{
    const firstNew=shown;shown+=24;render();
    document.querySelectorAll('.category-product')[firstNew]?.focus({preventScroll:true});
  };
}
initLanguage(render);
