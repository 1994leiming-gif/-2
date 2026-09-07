import allProducts from './data/all-products.js';
import { initLanguage, t, getLanguage, escapeHtml as esc, number, languageSwitch } from './i18n.js';
import { categories, paperIds, productTitle, imagePath, productLink, route, supplierUrl, wordmark, metadata, copyMessage, formStatus, emailError } from './site.js';

const state = { email:'', type:'paperbag', color:'', status:'', error:'', language:'', slide:null, capability:'production' };
const slides = [
  { src:'/factory/factory-hero-aerial.png', title:'galleryAerialTitle', desc:'galleryAerialDesc' },
  { src:'/factory/factory-office-exterior.jpg', title:'galleryOfficeExteriorTitle', desc:'galleryOfficeExteriorDesc' },
  { src:'/factory/factory-overview-02.jpg', title:'galleryOverviewTitle', desc:'galleryOverviewDesc' },
  { src:'/factory/production-raw-materials.jpg', title:'galleryRawMaterialsTitle', desc:'galleryRawMaterialsDesc' },
  { src:'/factory/production-printing.jpg', title:'galleryPrintingTitle', desc:'galleryPrintingDesc' },
  { src:'/factory/production-composition.jpg', title:'galleryCompositionTitle', desc:'galleryCompositionDesc' },
  { src:'/factory/production-laminating.jpg', title:'galleryLaminationTitle', desc:'galleryLaminationDesc' },
  { src:'/factory/production-hot-stamping.jpg', title:'galleryFoilTitle', desc:'galleryFoilDesc' },
  { src:'/factory/production-auto-bagging.jpg', title:'galleryBagMakingTitle', desc:'galleryBagMakingDesc' },
  { src:'/factory/quality-fatigue-test.jpg', title:'galleryFatigueTestTitle', desc:'galleryFatigueTestDesc' },
  { src:'/factory/quality-tensile-test.jpg', title:'galleryTensileTestTitle', desc:'galleryTensileTestDesc' },
  { src:'/factory/rd-sample-verification.jpg', title:'gallerySampleInspectionTitle', desc:'gallerySampleInspectionDesc' }
];
const capabilityPanels = {
  production: [
    { src:'/factory/production-raw-materials.jpg', title:'galleryRawMaterialsTitle', desc:'galleryRawMaterialsDesc' },
    { src:'/factory/production-printing.jpg', title:'galleryPrintingTitle', desc:'galleryPrintingDesc' },
    { src:'/factory/production-composition.jpg', title:'galleryCompositionTitle', desc:'galleryCompositionDesc' },
    { src:'/factory/production-laminating.jpg', title:'galleryLaminationTitle', desc:'galleryLaminationDesc' },
    { src:'/factory/production-hot-stamping.jpg', title:'galleryFoilTitle', desc:'galleryFoilDesc' },
    { src:'/factory/production-auto-bagging.jpg', title:'galleryBagMakingTitle', desc:'galleryBagMakingDesc' }
  ],
  quality: [
    { src:'/factory/quality-fatigue-test.jpg', title:'galleryFatigueTestTitle', desc:'galleryFatigueTestDesc' },
    { src:'/factory/quality-tensile-test.jpg', title:'galleryTensileTestTitle', desc:'galleryTensileTestDesc' }
  ],
  delivery: [
    { src:'/factory/rd-sample-verification.jpg', title:'gallerySampleInspectionTitle', desc:'gallerySampleInspectionDesc' },
    { src:'/factory/factory-office-exterior.jpg', title:'galleryOfficeExteriorTitle', desc:'galleryOfficeExteriorDesc' },
    { src:'/factory/factory-hero-aerial.png', title:'galleryAerialTitle', desc:'galleryAerialDesc' }
  ]
};
const capabilityKeys = { production:'capabilityProduction', quality:'capabilityQuality', delivery:'capabilityDelivery' };
let factoryVideoObserver;
const shownCategories = ['paperbag','nonwoven','paperbox','mailerbox','flexiblepack'];
function message() {
  return [t('inquiryHello'),t('email')+': '+state.email,t('productLabel')+': '+t(state.type),
    t('colorOptional')+': '+(state.color.trim()||t('pending'))].join('\n');
}
function modalMarkup() {
  return '<div class="certificate-modal" role="dialog" aria-modal="true" aria-label="'+t('campusGalleryLabel')+'" hidden>' +
    '<button type="button" class="cert-close" aria-label="'+t('close')+'">×</button>' +
    '<button type="button" class="cert-prev" aria-label="'+t('previous')+'"><span class="direction-arrow">←</span></button>' +
    '<figure><img alt=""><figcaption><b></b><span></span><small></small></figcaption></figure>' +
    '<button type="button" class="cert-next" aria-label="'+t('next')+'"><span class="direction-arrow">→</span></button>' +
    '<div class="cert-thumbs">'+slides.map((slide,i)=>'<button type="button" data-slide="'+i+'" aria-label="'+t('goSlide',{count:number(i+1)})+'"><img src="'+slide.src+'" alt=""></button>').join('')+'</div></div>';
}
function render() {
  factoryVideoObserver?.disconnect();
  if(state.language!==getLanguage()){state.status='';state.language=getLanguage();}
  metadata(t('titleHome'));
  document.querySelector('#app').innerHTML = `
<header class="topbar source-navigation">
  ${wordmark('#top')}
  <nav id="nav" aria-label="${t('nav')}">${[['directory','catalog'],['company','company'],['capability','capabilities'],['process','process']].map(([id,key])=>`<a href="#${id}">${t(key)}</a>`).join('')}</nav>
  <div class="nav-actions">${languageSwitch()}<a class="button button-sm" href="#contact">${t('quote')} ↗</a><button class="menu" type="button" aria-controls="nav" aria-label="${t('menuOpen')}" aria-expanded="false">☰</button></div>
</header>
<main id="top">
  <section class="hero source-hero">
    <div class="hero-copy"><div class="eyebrow">${t('heroEyebrow')}</div><h1>${t('heroTitle')}</h1><p class="lead">${t('heroIntro')}</p>
      <div class="hero-cta"><a class="button" href="#papers">${t('explore')} <span class="direction-arrow">→</span></a><a class="text-link" href="#contact">${t('quote')}</a></div>
      <div class="proof-row" aria-label="${t('metrics')}"><div><strong>${number(allProducts.length)}</strong><span>${t('productCount')}</span></div><div><strong>${number(categories.length)}</strong><span>${t('categoryCount')}</span></div><div><strong>${number(4)}</strong><span>${t('dimensions')}</span></div><div><strong lang="en" dir="ltr">OEM</strong><span>${t('customService')}</span></div></div>
    </div>
    <div class="paper-stage source-hero-image"><img src="/images/hero-packaging-source.webp" alt="${t('heroImage')}" fetchpriority="high"></div>
  </section>
  <section class="ticker"><div>${[1,2,3,4,5,1,2].map(i=>t('ticker'+i)+' <b aria-hidden="true">✦</b> ').join('')}</div></section>
  <section id="directory" class="collection-directory section-shell section-pad" aria-labelledby="directory-title">
    <header class="directory-heading"><span class="kicker">${t('catalogDirectoryEyebrow')}</span><h2 id="directory-title">${t('catalogDirectoryTitle')}</h2><div><p>${t('catalogDirectoryIntro')}</p><a href="${route('/category.html')}">${t('catalogDirectoryAll',{count:number(allProducts.length)})} <span class="direction-arrow">→</span></a></div></header>
    <nav class="directory-grid" aria-label="${t('catalogDirectoryTitle')}">${categories.map((category,index)=>{const count=allProducts.filter(item=>item.category===category).length;return `<a href="${route('/category.html?type='+category)}"><span>${number(index+1)}</span><div><strong>${t(category)}</strong><small>${t(category+'Desc')}</small></div><b>${t('catalogDirectoryOpen')} <span class="direction-arrow" aria-hidden="true">→</span></b><em>${t('catalogDirectoryCount',{count:number(count)})}</em></a>`;}).join('')}</nav>
    <small class="directory-scroll-note">${t('catalogDirectoryScroll')}</small>
  </section>
  <section id="papers" class="catalog section-pad">
    <div class="catalog-head section-shell"><div><span class="kicker">${number(1)} / ${t('catalog')}</span><h2>${t('catalog')}</h2></div><a class="catalog-all" href="${route('/category.html')}">${t('viewAll',{count:number(allProducts.length)})} <span class="direction-arrow">→</span></a></div>
    <div class="catalog-showcase">${shownCategories.map((category,index)=>{
      const items = category==='paperbag' ? paperIds.map(id=>allProducts.find(item=>item.id===id)) : allProducts.filter(item=>item.category===category).slice(0,6);
      return `<section class="catalog-block section-shell" data-category-key="${category}"><aside><small>${number(index+1)} / ${t(category)}</small><h3>${t(category)}</h3><p>${t(category+'Desc')}</p><a href="${route('/category.html?type='+category)}">${t('viewAll',{count:number(allProducts.filter(item=>item.category===category).length)})} <span class="direction-arrow">→</span></a></aside>
        <div class="catalog-product-wall">${items.map(item=>`<a href="${productLink(item)}" class="catalog-tile"><img src="${imagePath(item)}" alt="${esc(productTitle(item))}" loading="lazy"><span>${esc(productTitle(item))}</span><b>${t('tileNote')} ↗</b></a>`).join('')}</div></section>`;
    }).join('')}</div>
  </section>
  <section id="company" class="company-strength section-shell section-pad">
    <div class="company-intro"><span class="kicker">${number(2)} / ${t('company')}</span><h2>${t('companyTitle')}</h2><p>${t('companyIntro')}</p><a class="company-link" href="#contact">${t('companyLink')} ↗</a></div>
    <div class="company-cover"><img src="/factory/factory-hero-aerial.png" alt="${t('companyBuilding')}" loading="lazy"><span>${t('companyCover')}</span></div>
    <section class="factory-video-panel" aria-labelledby="factory-film-title">
      <div class="factory-video-copy"><span>${t('factoryFilmEyebrow')}</span><h3 id="factory-film-title">${t('factoryFilmTitle')}</h3><p>${t('factoryFilmIntro')}</p><small>${t('factoryFilmCaption')}</small></div>
      <video class="factory-film" controls playsinline muted preload="metadata" poster="/videos/factory-tour-poster.jpg" aria-label="${t('factoryFilmPosterAlt')}"><source src="/videos/factory-tour.mp4" type="video/mp4">${t('videoUnavailable')}</video>
    </section>
    <section class="certificate-collection campus-gallery-section" aria-labelledby="campus-title"><div class="certificate-copy"><span>${t('campusEyebrow')}</span><h3 id="campus-title">${t('campusTitle')}</h3><p>${t('campusIntro')}</p><strong>${t('campusPhotoCount',{count:number(slides.length)})}</strong></div>
      <div class="cert-film-window"><div class="cert-film-track">${slides.map((slide,i)=>`<button class="certificate-open" type="button" data-cert="${i}" aria-label="${t('campusOpen')}: ${t(slide.title)}"><img src="${slide.src}" alt="${t(slide.title)}" loading="lazy"><span>${number(i+1)}</span><b>${t('campusOpen')} <i class="direction-arrow" aria-hidden="true">↗</i></b></button>`).join('')}</div></div>
    </section>
    <div class="company-facts">${[1,2,3,4].map(i=>`<article><span>${number(i)}</span><strong>${t('fact'+i)}</strong><p>${t('fact'+i+'Desc')}</p></article>`).join('')}</div>
    <div class="company-strip">${[1,2,3,4,5].map(i=>'<span>'+t('strip'+i)+'</span>').join('')}</div>
  </section>
  <section id="capability" class="capability-tabs section-shell section-pad">
    <header class="capability-heading"><span class="kicker">${t('capabilityEyebrow')}</span><h2>${t('capabilityTitle')}</h2><div><p>${t('capabilityIntro')}</p><small>${t('capabilitySourceNote')}</small></div></header>
    <div class="capability-tablist" role="tablist" aria-label="${t('capabilityEyebrow')}">${Object.keys(capabilityPanels).map((key,index)=>`<button type="button" role="tab" id="capability-tab-${key}" data-capability-tab="${key}" aria-controls="capability-panel-${key}" aria-selected="${state.capability===key}" tabindex="${state.capability===key?'0':'-1'}"><span>${number(index+1)}</span>${t(capabilityKeys[key])}</button>`).join('')}</div>
    ${Object.entries(capabilityPanels).map(([key,items])=>`<div class="capability-panel" id="capability-panel-${key}" role="tabpanel" aria-labelledby="capability-tab-${key}" data-capability-panel="${key}" ${state.capability===key?'':'hidden'}><div class="capability-panel-copy"><strong>${t(capabilityKeys[key])}</strong><p>${t(capabilityKeys[key]+'Desc')}</p></div><div class="capability-media">${items.map(item=>`<figure><img src="${item.src}" alt="${t(item.title)}" loading="lazy"><figcaption><b>${t(item.title)}</b><span>${t(item.desc)}</span></figcaption></figure>`).join('')}</div></div>`).join('')}
  </section>
  <section id="process" class="process section-shell section-pad"><div class="section-head"><div><span class="kicker">${number(4)} / ${t('process')}</span><h2>${t('processTitle')}</h2></div><div class="big-number">${number(4)}<small>${t('processCount')}</small></div></div>
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
<footer>${wordmark('#top')}<p>${t('footerDesc')}</p><div><a href="#papers">${t('catalog')}</a><a href="#process">${t('process')}</a><a href="#contact">${t('contact')}</a></div><small>${t('rights')}</small></footer>
<aside class="supplier-service"><span>${t('onlineSupport')}</span><strong>${t('supplierSupport')}</strong><small>${t('supportDesc')}</small><a href="${supplierUrl}" target="_blank" rel="noopener">${t('supportLink')} ↗</a></aside>
${modalMarkup()}`;
  const menu = document.querySelector('.menu');
  const closeMenu = () => {document.querySelector('#nav').classList.remove('open');menu.setAttribute('aria-expanded','false');menu.setAttribute('aria-label',t('menuOpen'));menu.textContent='☰';};
  menu.onclick = () => {
    const open=document.querySelector('#nav').classList.toggle('open');
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
  const capabilityTabs=[...document.querySelectorAll('[data-capability-tab]')];
  capabilityTabs.forEach((button,index)=>{
    button.onclick=()=>showCapability(button.dataset.capabilityTab);
    button.onkeydown=event=>{
      if(!['ArrowLeft','ArrowRight','Home','End'].includes(event.key)) return;
      event.preventDefault();
      const direction=document.documentElement.dir==='rtl'?-1:1;
      const nextIndex=event.key==='Home'?0:event.key==='End'?capabilityTabs.length-1:
        (index+(event.key==='ArrowRight'?direction:-direction)+capabilityTabs.length)%capabilityTabs.length;
      const next=capabilityTabs[nextIndex];
      showCapability(next.dataset.capabilityTab);next.focus();
    };
  });
  initFactoryVideo();
  if(state.slide!==null)showSlide(state.slide);
}
function initFactoryVideo() {
  const video=document.querySelector('.factory-film');
  if(!video) return;
  let userControlled=false;
  const markUserControl=event=>{
    if(event.type==='keydown'&&![' ','Enter','k','K'].includes(event.key)) return;
    userControlled=true;
  };
  video.addEventListener('pointerdown',markUserControl,{passive:true});
  video.addEventListener('keydown',markUserControl);
  if(!('IntersectionObserver' in window)||navigator.connection?.saveData) return;
  factoryVideoObserver=new IntersectionObserver(entries=>{
    const entry=entries[0];
    if(userControlled) return;
    if(entry.isIntersecting&&entry.intersectionRatio>=.35){
      video.muted=true;
      video.play().catch(()=>{});
    }else{
      video.pause();
    }
  },{threshold:[0,.35,1]});
  factoryVideoObserver.observe(video);
}
function showCapability(key) {
  if(!capabilityPanels[key]) return;
  state.capability=key;
  document.querySelectorAll('[data-capability-tab]').forEach(button=>{
    const active=button.dataset.capabilityTab===key;
    button.setAttribute('aria-selected',String(active));
    button.tabIndex=active?0:-1;
  });
  document.querySelectorAll('[data-capability-panel]').forEach(panel=>panel.hidden=panel.dataset.capabilityPanel!==key);
}
function showSlide(index) {
  const wasClosed=state.slide===null;
  state.slide=(index+slides.length)%slides.length;
  const modal=document.querySelector('.certificate-modal');
  modal.hidden=false;document.body.classList.add('gallery-open');
  document.querySelector('#app > main').inert=true;
  const slide=slides[state.slide];
  modal.querySelector('figure img').src=slide.src;
  modal.querySelector('figure img').alt=t(slide.title);
  modal.querySelector('figcaption b').textContent=t(slide.title);
  modal.querySelector('figcaption span').textContent=t(slide.desc);
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
