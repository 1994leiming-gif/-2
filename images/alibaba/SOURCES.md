# Alibaba source image manifest

Downloaded on 2026-09-07 from the public storefront at <https://luzhouspecialty.m.en.alibaba.com/> using the original image responses loaded by the page. These are source assets, not screenshots.

| Local file | Original URL |
| --- | --- |
| `company-overview.avif` | `https://sc04.alicdn.com/kf/He1631c2b89fa4e2580e6f958057e344f0/286173918/He1631c2b89fa4e2580e6f958057e344f0.jpg` |
| `custom-packaging.avif` | `https://s.alicdn.com/@sc02/kf/Hddfcd36d43c3472190c3c4912278ba6eG.png?hasNWGrade=1` |
| `production-equipment.jpg` | `https://sc04.alicdn.com/kf/Hf3b670f334fe414ea4c70102503e4e639/286173918/Hf3b670f334fe414ea4c70102503e4e639.jpg` |
| `main-products.avif` | `https://sc04.alicdn.com/kf/Hf9b619f6157e48f0b7a89d71b8bbbc6aT/286173918/Hf9b619f6157e48f0b7a89d71b8bbbc6aT.jpg` |
| `certificates.avif` | `https://sc04.alicdn.com/kf/H644143447a6f427a8543905dcf88ca18H/286173918/H644143447a6f427a8543905dcf88ca18H.png` |
| `customization-process.avif` | `https://sc04.alicdn.com/kf/He6eeea87ffef472c97d42c6a237407f1U/286173918/He6eeea87ffef472c97d42c6a237407f1U.jpg` |

## Company profile originals

The structured Company page uses the following individual images loaded by the public Alibaba company profile. Local copies live in `images/company/`.

| Local file | Original URL |
| --- | --- |
| `overview.jpg` | `https://sc04.alicdn.com/kf/H20f59a2157844c41a00d1765d1335985w.jpg` |
| `factory-tour.jpg` | `https://s.alicdn.com/@lyj/pano_src/16317192ff244ce8928a252f7f5c4a82/cover.jpg` |
| `raw-materials.jpg` | `https://sc02.alicdn.com/kf/H4db31550f96b43e3a1a62db5a214a3f46.jpg` |
| `quality-test.jpg` | `https://sc02.alicdn.com/kf/H4c759da8df1e4f0e9c3cab23d24b4d70v.jpg` |
| `product-design.jpg` | `https://sc02.alicdn.com/kf/Hf94ee605b70c4be1a6d34c81400a1545f.jpg` |
| `printing.jpg` | `https://sc02.alicdn.com/kf/H1b99e7130c5a4f798269749bd5aec27eL.jpg` |
| `hot-stamping.jpg` | `https://sc02.alicdn.com/kf/Hfdab1117f3a54efdad4bfc614f51e9d00.jpg` |
| `bag-production.jpg` | `https://sc02.alicdn.com/kf/Hbe8179161e8243c0bab08789ce592c870.jpg` |

## Certificate panels

Alibaba exposes the supplier's certificates as the single 3683 × 550 source asset `certificates.avif`; no separate full-size certificate URLs were present in the loaded page. Files in `images/certificates/document-01.png` through `document-13.png` are lossless panel crops from that original source—not screenshots. The Quality page labels them as supplier-displayed documents and asks buyers to reconfirm holder, scope, issuer, and validity.

The Alibaba CDN responded with AVIF for five image requests despite the source URL suffix. Those files use the correct `.avif` extension locally. Capability and certificate imagery is supplier-presented material; the website copy requires product-specific reconfirmation rather than treating it as an independent certification.

## Footer company data

The Footer uses stable, buyer-relevant supplier facts rather than copying Alibaba's marketplace-wide link directory. Company identity, establishment year, registered address, and nearest listed port were checked against these public supplier pages on 2026-09-08:

- Supplier storefront: <https://luzhouspecialty.m.en.alibaba.com/>
- Verified supplier profile: <https://luzhouspecialty.en.alibaba.com/company_profile/trustpass_profile.html?certification_type=intl_assessment>
- Supplier assessment report: <https://verified.alibaba.com/supplier/report?aliId=2500001462458&wx_navbar_transparent=true>

Time-sensitive metrics such as response time and on-time dispatch rate are intentionally excluded from the Footer. Alibaba's tokenized contact URL is also not embedded; the compact contact control links to the stable supplier storefront.
