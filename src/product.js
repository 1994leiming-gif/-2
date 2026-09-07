import allProducts from './data/all-products.js';
import { initLanguage,t,number,getLanguage,escapeHtml as esc } from './i18n.js';
import { detailHeader,footer,metadata,productTitle,productSummary,imagePath,moq,price,route,productLink,parseColor,supplierUrl,copyMessage,formStatus,emailError,productUnit,checkedDate } from './site.js';
const params=new URLSearchParams(location.search);
const item=allProducts.find(product=>product.id===params.get('id'));
const color=parseColor(params.get('color'))||{h:145,s:42,l:50};
const state={...color,email:'',quantity:'',requirements:'',status:'',error:'',language:'',sourceOpen:false};
const related=item?allProducts.filter(product=>product.category===item.category&&product.id!==item.id).slice(0,4):[];
const hslToHex=(h,s,l)=>{
  s/=100;l/=100;const k=n=>(n+h/30)%12,a=s*Math.min(l,1-l),f=n=>l-a*Math.max(-1,Math.min(k(n)-3,Math.min(9-k(n),1)));
  return '#'+[f(0),f(8),f(4)].map(v=>Math.round(255*v).toString(16).padStart(2,'0')).join('').toUpperCase();
};
const config=()=> 'H'+state.h+' S'+state.s+' L'+state.l+' · '+hslToHex(state.h,state.s,state.l);
function message(){
  return [t('inquiryProduct',{name:productTitle(item)}),t('productId')+': '+item.id,
    t('email')+': '+(state.email.trim()||t('pending')),t('colorConfig')+': '+config(),
    t('quantity')+' ('+productUnit(item)+'): '+(state.quantity.trim()||t('pending')),t('requirements')+': '+(state.requirements.trim()||t('inquiryDefault'))].join('\n');
}
function render(){
  if(state.language!==getLanguage()){state.status='';state.language=getLanguage();}
  if(!item){
    metadata(t('productMissing'));
    document.querySelector('#product-app').innerHTML=detailHeader()+'<main class="empty-product"><h1>'+t('productMissing')+'</h1><p>'+t('productMissingDesc')+'</p><a class="button" href="'+route('/category.html')+'">'+t('explore')+'</a></main>'+footer();
    return;
  }
  const name=productTitle(item);
  metadata(t('productPageTitle',{name}),productSummary(item));
  document.querySelector('#product-app').innerHTML=`
  ${detailHeader('/category.html?type='+item.category,'backCategory')}
  <main>
    <section class="detail-hero">
      <div class="detail-gallery"><span class="detail-index">${t('productId')} / <bdi>${item.id}</bdi></span><img src="${imagePath(item)}" alt="${esc(name)}"></div>
      <div class="detail-copy"><span class="detail-category">${t(item.category)}</span><h1>${esc(name)}</h1><p class="detail-en">${esc(productSummary(item))}</p>
        <details class="source-title" ${state.sourceOpen?'open':''}><summary>${t('sourceTitle')}</summary><p lang="en" dir="ltr">${esc(item.subject)}</p></details>
        <div class="detail-price"><strong>${esc(price(item))}</strong><span>${t('priceNote')}</span></div>
        <div class="detail-specs"><div><small>${t('moq')}</small><b>${esc(moq(item))}</b></div><div><small>${t('orderUnit')}</small><b>${esc(productUnit(item))}</b></div><div><small>${t('specs')}</small><b>${t('unconfirmedSpecs')}</b></div></div>
        <a class="button detail-quote" href="#inquiry">${t('productQuote')} ↗</a><p class="detail-note">${t('productNote')}</p>
      </div>
    </section>
    <section class="product-data-panel" aria-labelledby="product-data-title">
      <div><span class="data-date">${t('catalogChecked',{date:checkedDate(item)})}</span><h2 id="product-data-title">${t('factsTitle')}</h2><p>${t('catalogScope')}</p>
      </div>
      <div><h3>${t('titleFeatures')}</h3><p>${esc(productSummary(item))}</p><p class="source-disclaimer">${t('titleFeaturesNote')}</p>
        <p class="source-disclaimer">${t('specificationsPending')}</p>
        ${!item.sourceCurrency?`<p class="data-warning">${t('unknownCurrency')}</p><p>${t('sourcePrice')}: <bdi lang="en" dir="ltr">${esc(item.price)}</bdi></p>`:''}
        ${item.price.endsWith('/ kilometer')?`<p class="data-warning">${t('unusualUnit')}</p>`:''}
        ${item.id==='1601929766011'?`<p class="data-warning">${t('handleMismatch')}</p>`:''}
      </div>
    </section>
    <section class="product-color-studio"><div><span>${t('colorEyebrow')}</span><h2>${t('colorTitle')}</h2><p>${t('colorIntro')}</p><p class="color-reference-note">${t('colorReference')}</p></div>
      <div class="product-color-panel"><div class="product-color-sample" id="product-color-sample"><img src="${imagePath(item)}" alt="${esc(name)}"><i>${t('colorPreview')}</i></div>
        <div class="product-color-controls"><strong id="product-color-code" dir="ltr">${config()}</strong>
          ${[['h','hue',360],['s','saturation',100],['l','lightness',100]].map(([key,label,max])=>`<label><span>${t(label)}</span><input id="product-${key}" name="${key}" aria-label="${t(label)}" type="range" min="0" max="${max}" value="${state[key]}" dir="ltr"><output>${number(state[key])}</output></label>`).join('')}
          <a class="button" href="#inquiry" id="use-product-color">${t('useColor')} ↓</a>
        </div>
      </div>
    </section>
    <section class="detail-features">${[1,2,3].map(i=>`<article><span>${number(i)}</span><h2>${t('feature'+i)}</h2><p>${t('feature'+i+'Desc')}</p></article>`).join('')}</section>
    <section id="inquiry" class="detail-inquiry"><div><span>${t('quote')}</span><h2>${t('inquiryTitle')}</h2><p>${t('productId')}: <bdi>${item.id}</bdi></p><a class="supplier-chat" href="${supplierUrl}" target="_blank" rel="noopener">${t('supplierChat')} ↗</a></div>
      <form id="detail-form" novalidate><label>${t('email')}<input name="email" type="email" autocomplete="email" dir="ltr" aria-describedby="detail-form-error" aria-invalid="${Boolean(state.error)}" placeholder="${t('emailPlaceholder')}" value="${esc(state.email)}"></label><p class="form-error" id="detail-form-error" role="alert">${state.error?t(state.error):''}</p>
        <label>${t('quantity')} (${esc(productUnit(item))})<input name="quantity" id="detail-quantity" dir="auto" placeholder="${t('quantityExample',{quantity:moq(item)})}" value="${esc(state.quantity)}"></label>
        <label>${t('colorConfig')}<input id="detail-color" name="color" readonly dir="ltr" value="${config()}"></label>
        <label>${t('requirements')}<textarea id="detail-request" name="requirements" dir="auto" placeholder="${t('requestPlaceholder')}">${esc(state.requirements)}</textarea></label>
        <button class="button" type="submit">${t('copyConfig')} ↗</button><div id="detail-form-note" aria-live="polite">${formStatus(state.status,message())}</div>
      </form>
    </section>
    <section class="related"><span>${t('related')}</span><h2>${t('relatedTitle')}</h2><div class="related-grid">${related.map(product=>`<a href="${productLink(product)}"><img src="${imagePath(product)}" alt="${esc(productTitle(product))}" loading="lazy"><b>${esc(productTitle(product))}</b><small>${t('viewDetails')} ↗</small></a>`).join('')}</div></section>
  </main>${footer()}`;
  const updateColor=()=>{
    document.querySelector('#product-color-sample').style.setProperty('--custom-color','hsl('+state.h+' '+state.s+'% '+state.l+'%)');
    document.querySelector('#product-color-code').textContent=config();
    document.querySelector('#detail-color').value=config();
    for(const key of ['h','s','l'])document.querySelector('#product-'+key).nextElementSibling.value=number(state[key]);
  };
  updateColor();
  for(const key of ['h','s','l'])document.querySelector('#product-'+key).oninput=event=>{
    state[key]=Number(event.target.value);state.status='';updateColor();
    document.querySelector('#detail-form-note').innerHTML=formStatus('',message());
  };
  document.querySelector('.source-title').ontoggle=event=>state.sourceOpen=event.target.open;
  const form=document.querySelector('#detail-form');
  form.oninput=()=>{
    for(const key of ['email','quantity','requirements'])state[key]=form.elements[key].value;
    state.status='';document.querySelector('#detail-form-note').innerHTML=formStatus('',message());
  };
  form.onsubmit=async event=>{
    event.preventDefault();
    state.error=emailError(form.elements.email);
    document.querySelector('#detail-form-error').textContent=state.error?t(state.error):'';
    form.elements.email.setAttribute('aria-invalid',String(Boolean(state.error)));
    if(state.error){form.elements.email.focus();return;}
    state.status=await copyMessage(message());
    document.querySelector('#detail-form-note').innerHTML=formStatus(state.status,message());
  };
}
initLanguage(render);
