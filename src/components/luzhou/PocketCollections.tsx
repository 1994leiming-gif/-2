import { ArrowRight, Plus } from "lucide-react";

import { collections } from "@/data/luzhou-products";
import type { PocketCatalogFilter } from "@/types/luzhou";

import styles from "./PocketSite.module.css";

const collectionImages = [
  "/luzhou/design-v2/collection-nonwoven.webp",
  "/luzhou/design-v2/collection-paper.webp",
  "/luzhou/design-v2/collection-flexible.webp",
];

const collectionFilters: PocketCatalogFilter[] = ["non-woven", "paper-gift", "flexible"];

export function PocketCollections({ onOpenCatalog }: { onOpenCatalog: (filter?: PocketCatalogFilter) => void }) {
  return (
    <section id="collections" className={`${styles.collectionsSection} ${styles.revealSection}`}>
      <div className={styles.collectionIntro}>
        <div><p className={styles.eyebrow}>Made for your brand</p><h2>Shop by<br />collection</h2></div>
        <div>
          <p>From everyday retail to luxury gifting, choose a foundation and make every detail your own.</p>
          <button className={styles.textArrowButton} type="button" onClick={() => onOpenCatalog()}>View all products <ArrowRight /></button>
        </div>
      </div>
      <div className={styles.collectionGrid}>
        {collections.map((collection, index) => (
          <button className={styles.collectionCard} type="button" onClick={() => onOpenCatalog(collectionFilters[index])} key={collection.name} aria-label={`View ${collection.name} products`}>
            <div className={styles.collectionImage}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={collectionImages[index]} alt={`${collection.name} with custom logo`} />
            </div>
            <span className={styles.collectionNumber}>0{index + 1}</span>
            <h3>{index === 1 ? "Paper & Gift Bags" : collection.name}</h3>
            <div className={styles.collectionDescription}><p>{collection.description}</p><Plus /></div>
          </button>
        ))}
      </div>
    </section>
  );
}
