import { Clock3, PackageCheck, Truck } from "lucide-react";

import { ArrowIcon } from "./icons";
import styles from "./PocketSite.module.css";

export function PocketCompany({ onOpenFactory }: { onOpenFactory: (index: number) => void }) {
  return (
    <section id="company" className={`${styles.companySection} ${styles.revealSection}`}>
      <div className={styles.companyCopy}>
        <p className={styles.eyebrowLight}>The company</p>
        <h2>Your production<br />partner from<br />concept to delivery.</h2>
        <p>Luzhou Transportation &amp; Logistics Supply Chain Management Co., Ltd. supplies customizable retail and gift packaging for global buyers.</p>
        <a className={styles.textArrowButton} href="#process">Explore our process <ArrowIcon /></a>
        <div className={styles.companyProof}>
          <div><PackageCheck /><strong>100+</strong><span>New products<br />per year</span></div>
          <div><Clock3 /><strong>100%</strong><span>On-time<br />dispatch</span></div>
          <div><Truck /><strong>Global</strong><span>Long-term support<br />for your brand</span></div>
        </div>
      </div>
      <button className={styles.factoryVisual} type="button" onClick={() => onOpenFactory(0)} aria-label="Open verified production photo gallery">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/luzhou/company/auto-producing-line.jpg" alt="Verified automatic bag production floor from the supplier profile" />
        <span className={styles.factoryAction}>View production floor <ArrowIcon /></span>
      </button>
    </section>
  );
}
