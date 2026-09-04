import { ArrowRight } from "lucide-react";

import { alibabaStoreUrl } from "@/data/luzhou-products";

import styles from "./PocketSite.module.css";

export function PocketHero({ onOpenCatalog }: { onOpenCatalog: () => void }) {
  return (
    <section id="top" className={styles.hero}>
      <div className={styles.heroCopy}>
        <h1>Packaging<br />that carries<br />more than<br />products.</h1>
        <p className={styles.heroIntro}>Custom packaging solutions that elevate your brand experience from the first touch.</p>
        <div className={styles.heroActions}>
          <button className={styles.primaryButton} type="button" onClick={() => onOpenCatalog()}>Explore products <ArrowRight /></button>
          <a className={styles.lineButton} href={alibabaStoreUrl} target="_blank" rel="noreferrer">Request a quote</a>
        </div>
        <div className={styles.heroMetrics} aria-label="Company highlights">
          <div><strong>100%</strong><span>On-time dispatch</span></div>
          <div><strong>&lt;1h</strong><span>Response time</span></div>
          <div><strong>100+</strong><span>New products / year</span></div>
          <div><strong>4</strong><span>Customization routes</span></div>
        </div>
      </div>
      <div className={styles.heroImage}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/luzhou/design-v2/hero-packaging.webp" alt="Custom paper and non-woven packaging bags with logo options" />
      </div>
    </section>
  );
}
