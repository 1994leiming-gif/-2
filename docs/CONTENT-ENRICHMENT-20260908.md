# Company and capabilities enrichment

Scope: English and Chinese versions of Company, Custom Packaging, and Production. Other localized pages and product data keep their existing content.

## Sources checked on 2026-09-08

- Storefront: https://luzhouspecialty.m.en.alibaba.com/
- Company profile: https://luzhouspecialty.m.en.alibaba.com/company_profile.html
- Customization process graphic: https://sc04.alicdn.com/kf/He6eeea87ffef472c97d42c6a237407f1U/286173918/He6eeea87ffef472c97d42c6a237407f1U.jpg

The seven stages in that graphic are Submit Requirements; Quotation & Communication; Design & Sample Confirmation; Place Order & Pay Deposit; Mass Production & QC; Final Payment & Shipment; After-sales Support. Website descriptions expand these stages into buyer guidance without introducing fixed deposits, lead times, MOQs or production-capacity guarantees.

The current company profile lists Minor customization, Drawing-based customization, Sample-based customization and Full customization. Production media labels include Raw Materials, Printing, Composition, Laminating, Hot Stamping, Bag Auto Producing, Cutting Machine and related equipment. Luzhou Port remains the nearest listed port.

## Added photographs

- `images/company/composition.jpg`: https://sc02.alicdn.com/kf/H916759e074fa4b179dbc1d75d1efbccdr.jpg
- `images/company/laminating.jpg`: https://sc02.alicdn.com/kf/H79aab44e14cb4ff78bfcf226961192b0S.jpg

Other photographs are existing source assets documented in `images/alibaba/SOURCES.md`. No AI-generated factory or team imagery was added.

## Implementation

`src/content-enrichment.js` is a shared HTML renderer for browser pages and generated static pages. The same expanded text, numbered flow, images, internal links and FAQ appear with or without JavaScript. Styles are scoped to the added components in `src/content-enrichment.css`.

The work starts from main commit `61d8635` (the current official-site release), not the older local preview branch.
