import allProducts from './data/all-products.js';
import { initLanguage, t, getLanguage, escapeHtml as esc, number, languageSwitch } from './i18n.js';
import { categories, paperIds, productTitle, imagePath, productLink, categoryLink, supplierUrl, wordmark, productMenu, initProductMenu, metadata, copyMessage, formStatus, emailError, route } from './site.js';

const state = { email:'', type:'paperbag', color:'', status:'', error:'', language:'', slide:null };
const slides = ['company-12.jpg','company-38.jpg','company-39.jpg','company-32.jpg','company-37.jpg'];
const gallery = [
  ['company-37.jpg','team'],['company-32.jpg','printing'],['company-28.jpg','factory'],
  ['company-10.jpg','stock'],['company-12.jpg','quality']
];
const shownCategories = ['paperbag','nonwoven','paperbox','mailerbox','flexiblepack'];
function message() {
  return [t('inquiryHello'),t('email')+': '+state.email,t('productLabel')+': '+t(state.type),
    t('colorOptional')+': '+(state.color.trim()||t('pending'))].join('\n');
}
function modalMarkup() {
  return '<div class="certificate-modal" role="dialog" aria-modal="true" aria-label="'+t('filesOpen')+'" hidden>' +
    '<button type="button" class="cert-close" aria-label="'+t('close')+'">×</button>' +
    '<button type="button" class="cert-prev" aria-label="'+t('previous')+'"><span class="direction-arrow">←</span></button>' +
    '<figure><img alt=""><figcaption><b></b><span></span><small></small></figcaption></figure>' +
    '<button type="button" class="cert-next" aria-label="'+t('next')+'"><span class="direction-arrow">→</span></button>' +
    '<div class="cert-thumbs">'+slides.map((src,i)=>'<button type="button" data-slide="'+i+'" aria-label="'+t('goSlide',{count:number(i+1)})+'"><img src="/company/'+src+'" alt=""></button>').join('')+'</div></div>';
}
function render() {
  document.body.classList.remove('nav-open');
  if(state.language!==getLanguage()){state.status='';state.language=getLanguage();}
  metadata(t('titleHome'));
  document.querySelector('#app').innerHTML = `
<header class="topbar source-navigation">
  ${wordmark('#top')}
  <nav id="nav" aria-label="${t('nav')}">${productMenu()}${[[route('/capabilities/custom-packaging/'),'capabilities'],[route('/capabilities/production/'),'process'],[route('/quality/'),'quality'],[route('/company/'),'company']].map(([href,key])=>`<a href="${href}">${t(key)}</a>`).join('')}</nav>
  <div class="nav-actions">${languageSwitch()}<a class="button button-sm" href="${route('/request-quote/')}">${t('quote')} ↗</a><button class="menu" type="button" aria-controls="nav" aria-label="${t('menuOpen')}" aria-expanded="false">☰</button></div>
</header>
<main id="top">
  <section class="hero source-hero">
    <div class="hero-copy"><div class="eyebrow">${t('heroEyebrow')}</div><h1>${t('heroTitle')}</h1><p class="lead">${t('heroIntro')}</p>
      <div class="hero-cta"><a class="button" href="#papers">${t('explore')} <span class="direction-arrow">→</span></a><a class="text-link" href="#contact">${t('quote')}</a></div>
      <div class="proof-row" aria-label="${t('metrics')}"><div><strong>${number(allProducts.length)}</strong><span>${t('productCount')}</span></div><div><strong>${number(categories.length)}</strong><span>${t('categoryCount')}</span></div><div><strong>${number(4)}</strong><span>${t('dimensions')}</span></div><div><strong lang="en" dir="ltr">OEM</strong><span>${t('customService')}</span></div></div>
    </div>
    <div class="paper-stage source-hero-image"><img src="/images/hero-packaging-source.webp" alt="${t('heroImage')}" fetchpriority="high"><img class="hero-brand-seal" src="/images/lu-packaging-stacked.png" alt="LU Packaging logo"></div>
  </section>
  <section class="ticker"><div>${[1,2,3,4,5,1,2].map(i=>t('ticker'+i)+' <b aria-hidden="true">✦</b> ').join('')}</div></section>
  <section id="papers" class="catalog section-pad">
    <div class="catalog-head section-shell"><div><span class="kicker">${number(1)} / ${t('catalog')}</span><h2>${t('catalog')}</h2></div><a class="catalog-all" href="${categoryLink('all')}">${t('viewAll',{count:number(allProducts.length)})} <span class="direction-arrow">→</span></a></div>
    <div class="catalog-showcase">${shownCategories.map((category,index)=>{
      const items = category==='paperbag' ? paperIds.map(id=>allProducts.find(item=>item.id===id)) : allProducts.filter(item=>item.category===category).slice(0,6);
      return `<section class="catalog-block section-shell" data-category-key="${category}"><aside><small>${number(index+1)} / ${t(category)}</small><h3>${t(category)}</h3><p>${t(category+'Desc')}</p><a href="${categoryLink(category)}">${t('viewAll',{count:number(allProducts.filter(item=>item.category===category).length)})} <span class="direction-arrow">→</span></a></aside>
        <div class="catalog-product-wall">${items.map(item=>`<a href="${productLink(item)}" class="catalog-tile"><img src="${imagePath(item)}" alt="${esc(productTitle(item))}" loading="lazy"><span>${esc(productTitle(item))}</span><b>${t('tileNote')} ↗</b></a>`).join('')}</div></section>`;
    }).join('')}</div>
  </section>
  <section id="company" class="company-strength section-shell section-pad">
    <div class="company-intro"><span class="kicker">${number(2)} / ${t('company')}</span><h2>${t('companyTitle')}</h2><p>${t('companyIntro')}</p><a class="company-link" href="#contact">${t('companyLink')} ↗</a></div>
    <section class="certificate-collection"><div class="certificate-copy"><span>${t('filesEyebrow')}</span><h3>${t('filesTitle')}</h3><p>${t('filesIntro')}</p></div>
      <div class="cert-film-window"><div class="cert-film-track">${slides.map((src,i)=>`<button class="certificate-open" type="button" data-cert="${i}" aria-label="${t('slide'+(i+1))}"><img src="/company/${src}" alt="${t('slide'+(i+1))}"><span>${number(i+1)}</span></button>`).join('')}</div></div>
    </section>
    <div class="company-cover"><img src="/company/company-building-crop.jpg" alt="${t('companyBuilding')}" loading="lazy"><span>${t('companyCover')}</span></div>
    <div class="company-gallery">${gallery.map(([src,key],i)=>`<figure class="company-shot ${i===0?'shot-wide':''}"><img src="/company/${src}" alt="${t(key)}" loading="lazy"><figcaption><b>${t(key)}</b><span>${t(key+'Desc')}</span></figcaption></figure>`).join('')}</div>
    <div class="company-facts">${[1,2,3,4].map(i=>`<article><span>${number(i)}</span><strong>${t('fact'+i)}</strong><p>${t('fact'+i+'Desc')}</p></article>`).join('')}</div>
    <div class="company-strip">${[1,2,3,4,5].map(i=>'<span>'+t('strip'+i)+'</span>').join('')}</div>
  </section>
  <section id="process" class="process section-shell section-pad"><div class="section-head"><div><span class="kicker">${number(3)} / ${t('process')}</span><h2>${t('processTitle')}</h2></div><div class="big-number">${number(4)}<small>${t('processCount')}</small></div></div>
    <div class="steps">${[1,2,3,4].map((i)=>`<article><b>${number(i)}</b><div class="step-icon" aria-hidden="true">${['✎','◫','✂','↗'][i-1]}</div><h3>${t('step'+i)}</h3><p>${t('step'+i+'Desc')}</p></article>`).join('')}</div>
  </section>
  <section id="contact" class="contact section-shell section-pad"><div><span class="kicker">${t('start')}</span><h2>${t('contactTitle')}</h2></div>
    <form id="sample-form" novalidate><label>${t('email')}<input name="email" type="email" autocomplete="email" dir="ltr" aria-describedby="form-error" aria-invalid="${Boolean(state.error)}" placeholder="${t('emailPlaceholder')}" value="${esc(state.email)}" required></label><p class="form-error" id="form-error" role="alert">${state.error?t(state.error):''}</p>
      <label>${t('productType')}<select name="type">${[...categories,'otherPackaging'].map(key=>`<option value="${key}" ${state.type===key?'selected':''}>${t(key)}</option>`).join('')}</select></label>
      <label>${t('colorOptional')}<input id="selected-color-input" name="color" dir="auto" placeholder="${t('colorPlaceholder')}" value="${esc(state.color)}"></label>
      <button class="button" type="submit">${t('copyInquiry')} ↗</button><p class="form-note" id="form-note" aria-live="polite">${formStatus(state.status,message())}</p>
    </form>
  </section>
  <section id="why" class="split-feature section-shell section-pad">
    <div class="bag-visual"><div class="handle h1"></div><div class="handle h2"></div><div class="bag"><span>${t('bagText')}</span><small>${t('bagDesc')}</small></div><div class="measure">↔ ${t('bagMeasure')}</div></div>
    <div class="feature-copy"><span class="kicker light">${t('whyEyebrow')}</span><h2>${t('whyTitle')}</h2><p>${t('whyDesc')}</p><ul>${[1,2,3].map(i=>`<li><span>${number(i)}</span><div><b>${t('why'+i)}</b><small>${t('why'+i+'Desc')}</small></div></li>`).join('')}</ul><a class="button inverse" href="#contact">${t('brief')} ↗</a></div>
  </section>
</main>
<footer>${wordmark('#top')}<p>${t('footerDesc')}</p><div><a href="${route('/products/featured/')}">${t('catalog')}</a><a href="${route('/capabilities/custom-packaging/')}">${t('capabilities')}</a><a href="${route('/quality/')}">${t('quality')}</a><a href="${route('/company/')}">${t('company')}</a><a href="${route('/request-quote/')}">${t('contact')}</a></div><small>${t('rights')}</small></footer>
<aside class="supplier-service"><span>${t('onlineSupport')}</span><strong>${t('supplierSupport')}</strong><small>${t('supportDesc')}</small><a href="${supplierUrl}" target="_blank" rel="noopener">${t('supportLink')} ↗</a></aside>
${modalMarkup()}`;
  const menu = document.querySelector('.menu');
  initProductMenu();
  const closeMenu = () => {document.querySelector('#nav').classList.remove('open');document.body.classList.remove('nav-open');menu.setAttribute('aria-expanded','false');menu.setAttribute('aria-label',t('menuOpen'));menu.textContent='☰';};
  menu.onclick = () => {
    const open=document.querySelector('#nav').classList.toggle('open');
    document.body.classList.toggle('nav-open',open);
    menu.setAttribute('aria-expanded',String(open));menu.setAttribute('aria-label',t(open?'menuClose':'menuOpen'));menu.textContent=open?'×':'☰';
  };
  document.querySelectorAll('#nav a').forEach(link=>link.onclick=closeMenu);
  const form = document.querySelector('#sample-form');
  form.oninput = form.onchange = () => {
    state.email=form.elements.email.value;state.type=form.elements.type.value;state.color=form.elements.color.value;
    state.status='';document.querySelector('#form-note').innerHTML=formStatus('',message());
  };
  form.onsubmit = async event => {
    event.preventDefault();
    state.error=emailError(form.elements.email,true);
    document.querySelector('#form-error').textContent=state.error?t(state.error):'';
    form.elements.email.setAttribute('aria-invalid',String(Boolean(state.error)));
    if(state.error){form.elements.email.focus();return;}
    state.status=await copyMessage(message());
    document.querySelector('#form-note').innerHTML=formStatus(state.status,message());
  };
  document.querySelectorAll('.certificate-open').forEach(button=>button.onclick=()=>showSlide(Number(button.dataset.cert)));
  document.querySelectorAll('[data-slide]').forEach(button=>button.onclick=()=>showSlide(Number(button.dataset.slide)));
  document.querySelector('.cert-close').onclick=closeModal;
  document.querySelector('.cert-prev').onclick=()=>showSlide(state.slide-1);
  document.querySelector('.cert-next').onclick=()=>showSlide(state.slide+1);
  document.querySelector('.certificate-modal').onclick=event=>{if(event.target.classList.contains('certificate-modal'))closeModal();};
  if(state.slide!==null)showSlide(state.slide);
}
function showSlide(index) {
  const wasClosed=state.slide===null;
  state.slide=(index+slides.length)%slides.length;
  const modal=document.querySelector('.certificate-modal');
  modal.hidden=false;document.body.classList.add('gallery-open');
  document.querySelector('#app > main').inert=true;
  modal.querySelector('figure img').src='/company/'+slides[state.slide];
  modal.querySelector('figure img').alt=t('slide'+(state.slide+1));
  modal.querySelector('figcaption b').textContent=t('slide'+(state.slide+1));
  modal.querySelector('figcaption span').textContent=t('slide'+(state.slide+1)+'Desc');
  modal.querySelector('figcaption small').textContent=number(state.slide+1)+' / '+number(slides.length);
  modal.querySelectorAll('[data-slide]').forEach(button=>{
    button.classList.toggle('active',Number(button.dataset.slide)===state.slide);
    button.setAttribute('aria-pressed',String(Number(button.dataset.slide)===state.slide));
  });
  if(wasClosed)modal.querySelector('.cert-close').focus();
}
function closeModal() {
  const last=state.slide;state.slide=null;document.querySelector('.certificate-modal').hidden=true;
  document.querySelector('#app > main').inert=false;
  document.body.classList.remove('gallery-open');
  document.querySelector('[data-cert="'+last+'"]')?.focus({preventScroll:true});
}
document.addEventListener('keydown',event=>{
  if(state.slide===null){if(event.key==='Escape')document.querySelector('#nav.open')&&document.querySelector('.menu').click();return;}
  if(event.key==='Escape')closeModal();
  if(event.key==='ArrowRight')showSlide(state.slide+1);
  if(event.key==='ArrowLeft')showSlide(state.slide-1);
  if(event.key==='Tab'){
    const buttons=[...document.querySelectorAll('.certificate-modal button')];
    const first=buttons[0],last=buttons.at(-1);
    if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus();}
    else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus();}
  }
});
initLanguage(render);
