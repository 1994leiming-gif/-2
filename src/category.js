import allProducts from './data/all-products.js';
import {initLanguage,t,escapeHtml as esc,number} from './i18n.js';
import {categories,detailHeader,footer,metadata,productTitle,productSummary,imagePath,moq,price,route,productLink,parseColor,checkedDate} from './site.js';

const PAGE_SIZE=24;
const params=new URLSearchParams(location.search);
const requested=params.get('type');
const type=categories.includes(requested)?requested:'all';
const invalid=Boolean(requested&&requested!=='all'&&type==='all');
const products=type==='all'?allProducts:allProducts.filter(item=>item.category===type);
const color=parseColor(params.get('color'));
const pageCount=Math.max(1,Math.ceil(products.length/PAGE_SIZE));

function pageFrom(search){
  const raw=new URLSearchParams(search).get('page');
  if(!raw||!/^\d+$/.test(raw))return 1;
  return Math.min(pageCount,Math.max(1,Number(raw)));
}

let page=pageFrom(location.search);

function pageUrl(targetPage,{localized=true}={}){
  const url=new URL(location.href);
  if(targetPage<=1)url.searchParams.delete('page');
  else url.searchParams.set('page',String(targetPage));
  const path=url.pathname+url.search+url.hash;
  return localized?route(path):path;
}

function paginationItems(current,total){
  if(total<=7)return Array.from({length:total},(_,index)=>index+1);
  const visible=new Set([1,total,current-1,current,current+1]);
  if(current<=3)[2,3,4].forEach(value=>visible.add(value));
  if(current>=total-2)[total-3,total-2,total-1].forEach(value=>visible.add(value));
  const pages=[...visible].filter(value=>value>=1&&value<=total).sort((a,b)=>a-b);
  const items=[];
  pages.forEach((value,index)=>{
    const previous=pages[index-1];
    if(previous&&value-previous===2)items.push(previous+1);
    else if(previous&&value-previous>2)items.push('ellipsis');
    items.push(value);
  });
  return items;
}

function paginationMarkup(){
  if(products.length<=PAGE_SIZE)return '';
  const link=(target,content,label,className,rel='')=>`<a class="${className}" data-page="${target}" href="${esc(pageUrl(target))}" aria-label="${esc(label)}"${rel?` rel="${rel}"`:''}>${content}</a>`;
  const items=paginationItems(page,pageCount).map(item=>{
    if(item==='ellipsis')return '<span class="category-pagination-ellipsis" aria-hidden="true">…</span>';
    if(item===page)return `<span class="category-pagination-page active" aria-current="page" aria-label="${esc(t('paginationCurrent',{count:number(page)}))}">${number(item)}</span>`;
    return link(item,number(item),t('paginationPage',{count:number(item)}),'category-pagination-page');
  }).join('');
  const previous=page>1?link(page-1,t('paginationPrevious'),t('paginationPrevious'),'category-pagination-arrow','prev'):`<span class="category-pagination-arrow disabled" aria-disabled="true">${t('paginationPrevious')}</span>`;
  const next=page<pageCount?link(page+1,t('paginationNext'),t('paginationNext'),'category-pagination-arrow','next'):`<span class="category-pagination-arrow disabled" aria-disabled="true">${t('paginationNext')}</span>`;
  return `<nav class="category-pagination" aria-label="${esc(t('paginationLabel'))}">${previous}<div class="category-pagination-pages">${items}</div>${next}</nav>`;
}

function focusRenderedPage(){
  requestAnimationFrame(()=>{
    const status=document.querySelector('#category-page-status');
    status?.focus({preventScroll:true});
    document.querySelector('.category-products')?.scrollIntoView({block:'start',behavior:'auto'});
  });
}

function goToPage(target,{push=true,focus=true}={}){
  const nextPage=Math.min(pageCount,Math.max(1,target));
  if(nextPage===page)return;
  page=nextPage;
  if(push)history.pushState({categoryPage:page},'',pageUrl(page));
  render();
  if(focus)focusRenderedPage();
}

function render(){
  const title=t(type==='all'?'allProducts':type);
  const start=(page-1)*PAGE_SIZE;
  const visibleProducts=products.slice(start,start+PAGE_SIZE);
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
    <section class="category-products" ${products.length?'aria-labelledby="category-page-status"':`aria-label="${esc(title)}"`}>
      ${products.length?`<p class="category-page-status" id="category-page-status" tabindex="-1">${t('paginationCurrent',{count:number(page)})} / ${number(pageCount)}</p>`:''}
      <div class="category-grid" id="category-grid">
        ${visibleProducts.map((item,i)=>`<a class="category-product" href="${productLink(item,color)}"><div><img src="${imagePath(item)}" alt="${esc(productTitle(item))}" loading="lazy"><span>${number(start+i+1)}</span></div><small>${t('moq')}: ${esc(moq(item))}</small><h2>${esc(productTitle(item))}</h2><p>${esc(productSummary(item))}</p><small class="catalog-product-id">${t('productId')} <bdi>${item.id}</bdi></small><b>${esc(price(item))}</b><i>${t('viewDetails')} ↗</i></a>`).join('')}
      </div>
      ${!products.length?'<p>'+t('categoryEmpty')+'</p>':''}
      ${paginationMarkup()}
    </section>
  </main>${footer()}`;
  document.querySelector('.category-pagination')?.addEventListener('click',event=>{
    const link=event.target.closest('a[data-page]');
    if(!link||event.defaultPrevented||event.button!==0||event.metaKey||event.ctrlKey||event.shiftKey||event.altKey)return;
    event.preventDefault();
    goToPage(Number(link.dataset.page));
  });
}

window.addEventListener('popstate',()=>{
  const nextPage=pageFrom(location.search);
  if(nextPage===page)return;
  page=nextPage;
  render();
  focusRenderedPage();
});

const canonicalPageUrl=pageUrl(page,{localized:false});
if(canonicalPageUrl!==location.pathname+location.search+location.hash)history.replaceState({categoryPage:page},'',canonicalPageUrl);
initLanguage(render);
