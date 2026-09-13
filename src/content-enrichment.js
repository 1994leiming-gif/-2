// Shared by the browser and static HTML build so the full content is indexable.
const media = '/images/company/';
const copy = {
  en: {
    process: 'From your first brief to after-sales support',
    processIntro: 'The seven stages below follow our Alibaba storefront’s customization process. Each stage gives you a clear point to review the specification, sample or order before moving forward.',
    stages: [
      ['Submit requirements', 'Tell us what the packaging will carry, the finished size, quantity and destination. Include your logo, artwork or a reference sample, plus any material and handle preferences.'],
      ['Quotation & communication', 'Review the proposed material, construction, print and finish together with the quotation. Confirm minimum order, sample costs, delivery requirements and the scope of the order.'],
      ['Design & sample confirmation', 'Check artwork placement, color, dimensions, structure and handles on the proposed sample. Agree any changes and approve the final specification before production.'],
      ['Place order & pay deposit', 'Confirm the order details and agreed payment terms. The deposit amount and production schedule are set in the quotation or order agreement.'],
      ['Mass production & quality control', 'Production follows the approved specification. Material preparation, printing, finishing and forming are coordinated with checks against the confirmed sample.'],
      ['Final payment & shipment', 'Confirm finished goods, packing details and the shipping arrangement. Settle the balance according to the order terms and coordinate dispatch to the agreed destination.'],
      ['After-sales support', 'Keep your order number and sample reference for delivery questions or repeat orders. If an issue arises, share photographs and affected quantities so the team can review it with you.'],
    ],
    customization: {
      eyebrow: 'YOUR BRAND, YOUR SPECIFICATION', title: 'Choose how you want to customize.',
      intro: 'Bring an existing design, a physical sample or a new packaging brief. The supplier profile lists four ways to work together.',
      cards: [
        ['Minor customization', 'Adapt an existing format with your logo, color or selected details. Start with a product from the collection and identify what needs to change.'],
        ['Drawing-based customization', 'Provide artwork or a dimensioned drawing. Review how the design translates into material, structure, print placement and finishing.'],
        ['Sample-based customization', 'Use a reference sample to explain the feel, shape and construction you need. Confirm the replacement materials and final sample together.'],
        ['Full customization', 'Develop the packaging from the intended use. Coordinate size, material, construction, branding and finishing as one specification.'],
      ],
    },
    choices: {eyebrow:'DETAILS THAT MAKE IT YOURS',title:'Define the bag, then refine the details.',intro:'Options depend on the selected product and construction. Use these details to prepare a brief that can be quoted and sampled.',cards:[
      ['Material & format','Paper, kraft, paperboard and non-woven constructions support different retail, gifting and carrying needs. Choose the format around the contents and intended use.'],
      ['Size & carrying needs','Specify width, height and gusset, the packed product weight and how the bag will be carried. A physical sample helps check the fit and handle comfort.'],
      ['Logo & color','Share your logo artwork and color reference. Confirm the print position, coverage and final appearance on the sample.'],
      ['Handles & finishing','Discuss rope, ribbon or other handles together with printing, lamination and foil details. Availability is confirmed for the chosen construction.'],
    ]},
    brief: 'A useful first inquiry includes', checklist:['Product type and intended use','Finished dimensions and quantity','Logo artwork or a reference sample','Material, color, handles and finish','Delivery destination and target date'],
    production:{eyebrow:'INSIDE THE PRODUCTION WORKFLOW',title:'How the packaging takes shape.',intro:'These stages correspond to the production processes shown in our Alibaba company profile. The route varies by material and design; not every bag requires every finish.',cards:[
      ['Raw materials','Prepare the selected paper or non-woven material for the agreed construction. Check that material and dimensions match the production specification.','raw-materials.jpg'],
      ['Printing','Apply the approved artwork and brand colors. Review placement, legibility and print consistency against the sample.','printing.jpg'],
      ['Composition','Combine material layers when the construction calls for it. The selected layers and bonding process depend on the packaging specification.','composition.jpg'],
      ['Laminating','Apply a surface layer where required for the chosen appearance and finish. Confirm the finish and compatibility during sampling.','laminating.jpg'],
      ['Hot stamping','Add foil details to logos or selected artwork areas when specified. Review alignment and appearance on the approved sample.','hot-stamping.jpg'],
      ['Cutting & bag making','Cut and form the approved shape, then complete the handles and structural details required by the design. The profile shows cutting and automatic bag-making equipment.','bag-production.jpg'],
    ]},
    checkpoints:{eyebrow:'REVIEW POINTS',title:'Keep the sample at the center of the process.',intro:'A written brief and an approved sample provide a shared reference from production planning through dispatch.',cards:[
      ['Before production','Confirm materials, dimensions, artwork, construction and packing requirements. Keep a clear record of the approved version.','product-design.jpg'],
      ['During production','Review printing, finishing and forming at the relevant stages. The supplier profile includes quality-testing equipment alongside production media.','quality-test.jpg'],
      ['Before dispatch','Review finished appearance, quantities and packing against the order. Confirm shipping details and the information needed for handover.','overview.jpg'],
    ]},
    company:{eyebrow:'OUR ROLE',title:'Packaging and logistics, coordinated from Luzhou.',intro:'Luzhou Transportation & Logistics Supply Chain Management Co., Ltd. connects packaging sourcing, customization and delivery. Our role is to help turn your brief into a specification that the production and logistics teams can work from.',cards:[
      ['Packaging sourcing','Explore paper bags, non-woven bags, gift packaging, boxes and selected retail carriers. Match the format to your product before deciding the details.'],
      ['Customization coordination','Bring together material, artwork, construction and sampling. Drawing-based, sample-based and full customization are listed on the supplier profile.'],
      ['Production follow-up','Carry the agreed specification through printing, finishing and bag making, with sample and quality review points along the way.'],
      ['Logistics coordination','The company profile lists Luzhou Port as the nearest port. Plan the transport route and destination requirements as part of the quotation and order.'],
    ]},
    companyProcess:'How we work with your team',companyIntro:'From the first inquiry to delivery and follow-up, our collaboration follows the seven-stage order process shown in the Alibaba storefront.',
    links:'Continue your project',customLink:'Explore custom packaging',productionLink:'See the production process',companyLink:'Meet LU Packaging',quote:'Discuss your packaging',
    faq:'Before you start',questions:[
      ['Can you print our logo?','Yes. Share your logo and intended product so we can discuss print position, colors and the suitable process. The approved sample is the reference for production.'],
      ['Do we need a finished design?','You can start with a drawing, a reference sample or a packaging brief. The supplier profile lists minor, drawing-based, sample-based and full customization.'],
      ['What are the minimum order and lead time?','They depend on the product, material, size, print and quantity. Request a quotation for your specification; sampling and production timing are agreed with the order.'],
    ],
  },
  zh: {
    process:'从提交需求，到售后支持',processIntro:'以下七个阶段对应阿里店铺公布的定制流程。在进入下一环节前，逐项确认规格、样品和订单要求。',
    stages:[
      ['提交需求','说明包装用途、成品尺寸、数量和收货地区，提供标识、设计稿或参考样品，以及材料、提手等偏好。'],
      ['报价与沟通','共同确认材料、结构、印刷与表面工艺，并核对报价、起订量、样品费用、交付要求及订单范围。'],
      ['设计与样品确认','核对样品的图案位置、颜色、尺寸、结构和提手。完成必要修改，确认最终规格后进入生产。'],
      ['下单并支付定金','确认订单内容与双方约定的付款条款。定金金额和排产安排以报价及订单约定为准。'],
      ['批量生产与质检','按照确认规格组织原料准备、印刷、表面加工及成型，并以确认样品作为过程核对的依据。'],
      ['尾款与发货','核对成品、装箱及运输安排，按订单约定结算尾款，并协调发运至约定目的地。'],
      ['售后支持','保留订单编号与确认样品，便于交付沟通及复购。如有问题，提供照片和涉及数量，由团队跟进核对。'],
    ],
    customization:{eyebrow:'围绕你的品牌定制',title:'选择适合项目的定制方式。',intro:'可以从已有设计、实物样品或新的包装需求开始。阿里供应商档案列出了以下四种定制服务。',cards:[
      ['轻度定制','在已有款式上调整标识、颜色或部分细节。先选定产品，再说明需要改变的地方。'],
      ['按图定制','提供设计稿或标注尺寸的图纸，沟通材料、结构、图案位置和表面工艺的实现方式。'],
      ['按样定制','用参考样品说明手感、形状和结构要求，共同确认材料选择及最终打样效果。'],
      ['深度定制','从实际用途出发，将尺寸、材质、结构、品牌呈现和表面工艺整合为完整规格。'],
    ]},
    choices:{eyebrow:'把定制细节说清楚',title:'先确定袋型，再完善细节。',intro:'可选方案取决于具体产品和结构。以下信息有助于形成可报价、可打样的需求。',cards:[
      ['材质与袋型','纸张、牛皮纸、纸板和无纺布适用于不同零售、礼赠与携带场景，根据内装产品及用途选择。'],
      ['尺寸与携带需求','说明宽度、高度、侧宽、内装重量和提拿方式，通过实物样品检查适配程度与提手舒适度。'],
      ['标识与颜色','提供标识文件和颜色参考，确认印刷位置、覆盖范围，并通过样品核对最终效果。'],
      ['提手与表面工艺','结合袋型沟通绳柄、丝带等提手，以及印刷、覆膜和烫印细节，具体可选项按结构确认。'],
    ]},
    brief:'首次询价建议准备',checklist:['产品类型与用途','成品尺寸及预计数量','标识设计稿或参考样品','材料、颜色、提手与工艺要求','收货地区与期望交期'],
    production:{eyebrow:'走进生产流程',title:'一只包装袋，如何成型。',intro:'以下环节对应阿里企业档案展示的生产工序。实际路线根据材质与设计确定，并非每款包装都需要全部工艺。',cards:[
      ['原料准备','根据确认结构准备纸张、无纺布等材料，核对材料与尺寸是否符合生产规格。','raw-materials.jpg'],
      ['印刷','印制确认后的图文与品牌颜色，对照样品检查位置、清晰度和印刷一致性。','printing.jpg'],
      ['复合','在结构需要时结合多层材料，材料组合与复合方式按具体包装要求确定。','composition.jpg'],
      ['覆膜','根据外观与表面要求进行覆膜加工，在打样阶段确认表面效果及材料适配。','laminating.jpg'],
      ['烫印','按设计在标识或指定图案区域加入箔片细节，通过确认样核对位置和效果。','hot-stamping.jpg'],
      ['裁切与制袋','裁切并形成确认袋型，完成提手与结构细节。供应商档案展示了裁切及自动制袋设备。','bag-production.jpg'],
    ]},
    checkpoints:{eyebrow:'关键确认节点',title:'让确认样品贯穿生产过程。',intro:'书面需求与确认样品，为排产、加工及发货提供共同的核对依据。',cards:[
      ['生产前','确认材质、尺寸、设计稿、结构和装箱要求，保留最终确认版本。','product-design.jpg'],
      ['生产中','在印刷、表面加工与成型等对应环节核对效果。阿里档案同时展示了生产和质量检测设备。','quality-test.jpg'],
      ['发货前','根据订单核对成品外观、数量和包装，并确认运输及交接所需信息。','overview.jpg'],
    ]},
    company:{eyebrow:'我们的角色',title:'立足泸州，衔接包装与物流。',intro:'泸州交通物流供应链管理有限公司协同包装采购、定制与交付，将客户需求整理为生产及物流团队可以衔接的项目规格。',cards:[
      ['包装采购','涵盖纸袋、无纺布袋、礼品包装、纸盒及部分零售提袋，先匹配产品用途，再确定细节。'],
      ['定制协同','衔接材料、设计、结构与打样，支持档案列出的按图、按样和深度定制等服务。'],
      ['生产跟进','把确认规格带入印刷、表面处理与制袋环节，并在过程中设置样品与质量核对节点。'],
      ['物流协调','企业档案列出的最近港口为泸州港，在报价与订单阶段共同确定运输路线及目的地要求。'],
    ]},
    companyProcess:'我们如何与你的团队协作',companyIntro:'从首次询价到交付及后续跟进，按照阿里店铺公布的七步订单流程组织沟通。',
    links:'继续了解你的包装项目',customLink:'了解包装定制',productionLink:'查看生产流程',companyLink:'了解泸州包装',quote:'沟通包装需求',
    faq:'开始前，你可能想了解',questions:[
      ['可以印我们的标识吗？','可以。提供标识文件及需要的产品，我们会沟通印刷位置、颜色和适用工艺，最终以确认样品作为生产依据。'],
      ['一定要有完整设计稿吗？','可以从图纸、参考样品或包装需求开始。供应商档案列出了轻度、按图、按样和深度定制服务。'],
      ['起订量和交期是多少？','取决于产品、材料、尺寸、印刷和数量。请按具体规格询价，打样与量产时间在订单中确认。'],
    ],
  },
};

const escape = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const label = index => String(index + 1).padStart(2, '0');
const heading = block => `<header class="enrichment-heading"><span class="kicker">${escape(block.eyebrow)}</span><h2>${escape(block.title)}</h2><p>${escape(block.intro)}</p></header>`;
const cards = block => `<section class="content-enrichment section-shell">${heading(block)}<div class="enrichment-grid">${block.cards.map(([title,body,image],i)=>`<article class="enrichment-card">${image?`<img src="${media+image}" alt="${escape(title)}" loading="lazy" width="1280" height="720">`:''}<div><span class="enrichment-number">${label(i)}</span><h3>${escape(title)}</h3><p>${escape(body)}</p></div></article>`).join('')}</div></section>`;

export function renderContentEnrichment(slug, language) {
  const c=copy[language];
  if(!c || !['company','capabilities/custom-packaging','capabilities/production'].includes(slug)) return '';
  const href=path=>(language==='zh'?'':'/'+language)+'/'+path+'/';
  const process=`<section class="content-enrichment enrichment-process section-shell"><header class="enrichment-heading"><span class="kicker">${language==='zh'?'合作流程':'OUR PROCESS'}</span><h2>${escape(slug==='company'?c.companyProcess:c.process)}</h2><p>${escape(slug==='company'?c.companyIntro:c.processIntro)}</p></header><ol class="enrichment-timeline">${c.stages.map(([title,body],i)=>`<li><span class="enrichment-number">${label(i)}</span><div><h3>${escape(title)}</h3><p>${escape(body)}</p></div></li>`).join('')}</ol></section>`;
  const links=`<nav class="enrichment-links section-shell" aria-label="${escape(c.links)}">${[['capabilities/custom-packaging',c.customLink],['capabilities/production',c.productionLink],['company',c.companyLink]].filter(([path])=>path!==slug).map(([path,title])=>`<a href="${href(path)}">${escape(title)} <span aria-hidden="true">↗</span></a>`).join('')}<a href="${href('request-quote')}">${escape(c.quote)} <span aria-hidden="true">↗</span></a></nav>`;
  if(slug==='company') return cards(c.company)+process+links;
  if(slug==='capabilities/production') return cards(c.production)+cards(c.checkpoints)+process+links;
  const checklist=`<section class="content-enrichment enrichment-brief section-shell"><div><span class="kicker">${language==='zh'?'准备你的需求':'PREPARE YOUR BRIEF'}</span><h2>${escape(c.brief)}</h2><a class="button" href="${href('request-quote')}">${escape(c.quote)} ↗</a></div><ul>${c.checklist.map(item=>`<li>${escape(item)}</li>`).join('')}</ul></section>`;
  const faq=`<section class="content-enrichment enrichment-faq section-shell"><h2>${escape(c.faq)}</h2>${c.questions.map(([q,a])=>`<details><summary>${escape(q)}</summary><p>${escape(a)}</p></details>`).join('')}</section>`;
  return cards(c.customization)+process+cards(c.choices)+checklist+faq+links;
}
