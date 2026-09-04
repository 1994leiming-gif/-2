import styles from "./PocketSite.module.css";

const steps = [
  { title: "Print", description: "Color and artwork applied to the selected substrate.", image: "/luzhou/company/printing.jpg", galleryIndex: 2 },
  { title: "Laminate", description: "Surface protection and finish are added where required.", image: "/luzhou/company/laminating.jpg", galleryIndex: 4 },
  { title: "Form", description: "Automated bag production turns prepared material into volume.", image: "/luzhou/company/auto-producing.jpg", galleryIndex: 6 },
  { title: "Finish", description: "Foil and specialty details elevate the final presentation.", image: "/luzhou/company/hot-stamping.jpg", galleryIndex: 5 },
  { title: "Quality & Pack", description: "Strict QC across materials and finished goods.", image: "/luzhou/company/quality-control.jpg", galleryIndex: 12 },
];

export function PocketProcess({ onOpenFactory }: { onOpenFactory: (index: number) => void }) {
  return (
    <section id="process" className={`${styles.processSection} ${styles.revealSection}`}>
      <div className={styles.processHeader}>
        <div><p className={styles.eyebrow}>Inside production</p><h2>From material to finished bag.</h2></div>
        <p>Strict quality control at every step<br />to ensure every bag represents your brand.</p>
      </div>
      <div className={styles.processGrid}>
        {steps.map((step, index) => (
          <article className={styles.processCard} key={step.title}>
            <button className={styles.processImage} type="button" aria-label={`View ${step.title} factory details`} onClick={() => onOpenFactory(step.galleryIndex)}>
              <span>0{index + 1}</span>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={step.image} alt={`${step.title} production process`} />
            </button>
            <h3>{step.title}</h3><p>{step.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
