import { ArrowRight } from "lucide-react";

import { alibabaStoreUrl } from "@/data/luzhou-products";

import styles from "./PocketSite.module.css";

export function PocketConversionFooter({ onOpenCatalog }: { onOpenCatalog: () => void }) {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerMain}>
        <a className={styles.footerWordmark} href="#top"><span>luzhou</span><span>packaging</span></a>
        <div className={styles.footerColumn}>
          <strong>Products</strong>
          <button type="button" onClick={() => onOpenCatalog()}>Non-Woven Bags</button>
          <button type="button" onClick={() => onOpenCatalog()}>Paper &amp; Gift Bags</button>
          <button type="button" onClick={() => onOpenCatalog()}>Flexible Packaging</button>
          <button type="button" onClick={() => onOpenCatalog()}>All Products</button>
        </div>
        <div className={styles.footerColumn}>
          <strong>Company</strong><a href="#company">About Us</a><a href="#company">Our Factory</a><a href="#process">Quality Control</a><a href="#process">Certifications</a>
        </div>
        <div className={styles.footerColumn}>
          <strong>Capabilities</strong><a href="#collections">Customization</a><a href="#collections">Materials</a><a href="#process">Printing &amp; Finishing</a><a href="#company">Sustainability</a>
        </div>
        <div className={styles.footerColumn}>
          <strong>Support</strong><button type="button" onClick={() => onOpenCatalog()}>FAQ</button><button type="button" onClick={() => onOpenCatalog()}>Help Center</button><a href={alibabaStoreUrl} target="_blank" rel="noreferrer">Contact Us</a><a href={alibabaStoreUrl} target="_blank" rel="noreferrer">Request a Quote</a>
        </div>
        <div className={styles.footerCta}>
          <h2>Let&apos;s build packaging<br />that grows your brand.</h2>
          <a href={alibabaStoreUrl} target="_blank" rel="noreferrer">Request a quote <ArrowRight /></a>
        </div>
      </div>
      <div className={styles.legalRow}>
        <span>© 2026 Luzhou Transportation &amp; Logistics Supply Chain Management Co., Ltd. All rights reserved.</span>
        <div><a href={alibabaStoreUrl} target="_blank" rel="noreferrer">Privacy Policy</a><i /> <a href={alibabaStoreUrl} target="_blank" rel="noreferrer">Terms of Use</a></div>
      </div>
    </footer>
  );
}
