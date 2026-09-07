# LU Packaging 多语言 SEO 实施方案

状态：实施基线  
站点：`https://lu-packaging.com`  
最后更新：2026-09-07

## 1. 目标

让搜索引擎能够分别发现、理解和索引 10 种语言的首页、分类页与 278 个产品页，同时保持现有页面体验、产品数据边界和无自动语言跳转原则。

本方案不承诺排名。技术 SEO 负责消除抓取和理解障碍；持续排名还依赖真实内容、行业引用、外链、用户需求匹配和后续数据迭代。

## 2. 当前问题

- 语言由 `?lang=` 控制，没有稳定的语言目录 URL。
- 产品由 `product.html?id=...` 控制，分类由 `category.html?type=...` 控制，URL 可读性与可维护性较弱。
- 首次返回的 HTML 只有空的应用容器；标题、正文和产品信息需要 JavaScript 执行后才出现。
- 缺少自引用 canonical、完整 hreflang 集、Open Graph、Twitter Card、JSON-LD、robots.txt 和 XML sitemap。
- 缺少面向搜索引擎的 404/noindex 策略和旧参数 URL 收敛规则。
- 278 张产品图可被页面发现，但未进入图片 sitemap。
- 尚未建立 Search Console、Bing Webmaster Tools、核心网页指标与索引覆盖率的运营闭环。

## 3. URL 与语言架构

中文保留域名根目录，避免首页迁移；其他语言使用一级语言目录。不根据 IP 或浏览器语言自动重定向。

| 语言 | hreflang | 首页路径 | 示例产品路径 |
| --- | --- | --- | --- |
| 中文 | `zh-CN` | `/` | `/products/1601925527548/` |
| English | `en` | `/en/` | `/en/products/1601925527548/` |
| Français | `fr-FR` | `/fr/` | `/fr/products/1601925527548/` |
| Deutsch | `de-DE` | `/de/` | `/de/products/1601925527548/` |
| Español | `es-ES` | `/es/` | `/es/products/1601925527548/` |
| Italiano | `it-IT` | `/it/` | `/it/products/1601925527548/` |
| العربية | `ar` | `/ar/` | `/ar/products/1601925527548/` |
| Русский | `ru-RU` | `/ru/` | `/ru/products/1601925527548/` |
| हिन्दी | `hi-IN` | `/hi/` | `/hi/products/1601925527548/` |
| Bahasa Indonesia | `id-ID` | `/id/` | `/id/products/1601925527548/` |

分类路径采用同一结构：

- 中文：`/categories/paperbag/`
- 英文：`/en/categories/paperbag/`
- 其余语言：`/{language}/categories/{category}/`
- 全部产品：`/categories/all/` 及其语言版本

每个页面的语言切换器必须跳到同一实体的对应语言 URL，而不是仅在当前 URL 内替换文字。

## 4. 索引与 canonical 规则

- 每个干净 URL 使用自引用 canonical。
- 每个可索引页面输出包含自身在内的 10 个双向 hreflang，以及 `x-default` 指向中文对应页。
- sitemap 只收录干净 canonical URL。
- 旧的 `?lang=`、`category.html?type=`、`product.html?id=` 保持可访问，供旧链接兼容；运行时把 canonical 指向对应干净 URL，且站内不再产生旧链接。
- 无效产品、无效分类和构建生成的 404 页面使用 `noindex, follow`。
- 颜色配置、筛选状态等参数不创建独立索引页，canonical 回不带参数的实体页。

## 5. 页面级 metadata

每个语言与实体都必须在初始 HTML 中包含：

- 唯一、简洁且与页面 H1 一致的 `<title>`。
- 唯一的本地化 meta description，不堆砌关键词。
- `robots=index,follow,max-image-preview:large`。
- canonical 与完整 hreflang。
- Open Graph：`og:type`、`og:site_name`、`og:title`、`og:description`、`og:url`、`og:locale`、`og:image`。
- Twitter Card：`summary_large_image`、标题、描述和图片。
- 产品页使用产品主图；首页和分类页使用代表性品牌/包装图片。
- 正确的 `<html lang>`，阿拉伯语同时设置 `dir="rtl"`。

## 6. 初始 HTML 与内容

构建脚本为所有 canonical URL 生成真实静态 HTML，而不是只返回空应用壳：

- 首页：品牌主张、公司简介、主要分类与可抓取链接。
- 分类页：本地化 H1、分类说明、产品数量及首批产品链接。
- 产品页：本地化产品名、摘要、主图、产品 ID、分类、MOQ 和询价入口。

客户端 JavaScript 加载后接管完整交互界面。初始内容与渲染后内容必须表达同一事实，避免误导搜索引擎。

## 7. 结构化数据

- 首页：`WebSite` 与 `Organization`。
- 分类页：`CollectionPage` 与 `BreadcrumbList`。
- 产品页：`Product` 与 `BreadcrumbList`，包括名称、描述、图片和 SKU。
- 不虚构评分、评价、库存、品牌、GTIN 或价格有效期。
- 当前网站是询价目录且部分价格/币种存在核验边界，因此暂不输出 `Offer`。等确认真实成交币种、库存与有效期后，再进入 Google 产品富结果/商家列表阶段。
- JSON-LD 中的事实必须在可见页面中也能找到。

## 8. Sitemap 与抓取

- 根目录 `robots.txt` 允许抓取公开页面，声明 sitemap index。
- `sitemap.xml` 为 sitemap index，拆分为每种语言一个 sitemap。
- 每个语言 sitemap 收录首页、8 个分类页和 278 个产品页，共 287 个 URL。
- sitemap URL 使用绝对 HTTPS canonical，带真实 `lastmod`；产品页加入主图的 image sitemap 信息，并关联所有语言版本。
- 不填写 Google 忽略的 `priority` 和 `changefreq`。

预计总量：2,870 个本地化 canonical 页面。

## 9. 性能与图片 SEO

- 保留首屏图片 `fetchpriority="high"`，非首屏继续懒加载。
- 产品图片使用稳定 URL、本地化且描述性的 alt；不进行关键词堆砌。
- 后续将产品图片批量生成 WebP/AVIF 与尺寸变体，补充 `width`、`height`、`srcset`，减少 CLS 与传输量。
- 字体继续本地托管；上线后以真实 CrUX/Search Console 数据判断是否需要进一步拆 CSS 或预加载。

## 10. 站外与运营工作

以下项目不能仅通过代码完成，需要站点所有者账号或真实业务资料：

1. 在 Google Search Console 和 Bing Webmaster Tools 验证域名。
2. 提交 `https://lu-packaging.com/sitemap.xml`。
3. 确认公司法定英文名、地址、电话、邮箱、营业时间和社交主页后，扩充 Organization 数据。
4. 建立 Google Business Profile（若业务条件适用）。
5. 为重点品类制作原创采购指南、材质比较、印刷工艺、MOQ、交期和案例内容。
6. 从行业协会、物流园区、客户案例和真实合作伙伴获取高质量引用与链接。
7. 每月查看查询词、展示、点击、CTR、索引覆盖与 Core Web Vitals，按语言单独迭代。

## 11. 分阶段实施

### Phase A — 本次代码实施

- 干净的多语言首页、分类和产品路径。
- 静态预生成 2,870 个页面。
- 初始 HTML metadata、canonical、hreflang、OG/Twitter。
- WebSite、Organization、CollectionPage、Product、BreadcrumbList JSON-LD。
- robots.txt、语言 sitemap 和 sitemap index。
- 语言切换与所有站内链接迁移到干净路径。
- 自动化校验：URL 数量、语言标签、canonical、hreflang 双向完整性、结构化数据解析、无坏链。

### Phase B — 业务资料确认后

- 补齐 Organization 联系与所在地信息。
- 确认实时价格、币种、库存、有效期和交易方式后评估 Offer/Merchant Center。
- 补充真实认证、工厂能力、案例和 FAQ 内容；只标记页面真实展示的结构化数据。

### Phase C — 上线后持续优化

- Search Console/Bing 提交与索引监控。
- 重点市场关键词与落地页内容研究。
- 图片格式、尺寸和 Core Web Vitals 优化。
- 按语言分析 CTR 与询价转化，每月更新内容。

## 12. 本次验收标准

- 构建无错误并准确生成 2,870 个 canonical HTML 页面。
- 10 个 sitemap 各 287 个 URL，sitemap index 可解析。
- 每类抽样页的 title、description、canonical、hreflang、OG 和 JSON-LD 均存在且本地化。
- 10 种语言的首页、分类页、产品页均返回 200；阿拉伯语为 RTL。
- 语言切换器保持在相同页面实体，并切换到目标语言路径。
- 站内主要链接不再生成 `?lang=`、`category.html?type=` 或 `product.html?id=`。
- 404/无效实体不会被索引。
- 部署后 robots.txt、sitemap.xml、canonical 页面和关键资源均可公开访问。

## 13. 官方依据

- Google 多语言网站：https://developers.google.com/search/docs/specialty/international/managing-multi-regional-sites
- Google JavaScript SEO：https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics
- Google canonical：https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls
- Google sitemap：https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap
- Google 标题与摘要：https://developers.google.com/search/docs/appearance/title-link 与 https://developers.google.com/search/docs/appearance/snippet
- Google 产品结构化数据：https://developers.google.com/search/docs/appearance/structured-data/product
- Google 图片 SEO：https://developers.google.com/search/docs/appearance/google-images
- Schema.org：https://schema.org/
