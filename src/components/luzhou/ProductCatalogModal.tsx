"use client";

import { useEffect } from "react";

import { pocketProducts } from "@/data/luzhou-products";
import type { PocketCatalogFilter, PocketProduct } from "@/types/luzhou";

import { CloseIcon } from "./icons";
import styles from "./PocketSite.module.css";

const filterDetails: Record<PocketCatalogFilter, { title: string; description: string }> = {
  "non-woven": { title: "Non-Woven Bags", description: "Reusable, high-load totes with customizable colors, sizes and logo printing." },
  "paper-gift": { title: "Paper & Gift Bags", description: "Retail, gifting and luxury paper solutions with custom handles, foil and print finishes." },
  flexible: { title: "Flexible Packaging", description: "Lightweight protective packaging with artwork, color and format customization." },
};

function matchesFilter(product: PocketProduct, filter: PocketCatalogFilter | null) {
  if (!filter) return true;
  if (filter === "non-woven") return product.category === "Non-Woven";
  if (filter === "flexible") return product.category === "Plastic Bag" || product.id === "1601929692010";
  return product.category !== "Non-Woven" && product.category !== "Plastic Bag";
}

export function ProductCatalogModal({ open, filter, onClose, onSelect }: { open: boolean; filter: PocketCatalogFilter | null; onClose: () => void; onSelect: (product: PocketProduct) => void }) {
  useEffect(() => {
    if (!open) return;
    const handleKey = (event: KeyboardEvent) => { if (event.key === "Escape") onClose(); };
    document.body.dataset.catalogOpen = "true";
    window.addEventListener("keydown", handleKey);
    return () => {
      delete document.body.dataset.catalogOpen;
      window.removeEventListener("keydown", handleKey);
    };
  }, [onClose, open]);

  if (!open) return null;

  const visibleProducts = pocketProducts.filter((product) => matchesFilter(product, filter));
  const heading = filter ? filterDetails[filter] : { title: "Product collection", description: "Explore customizable packaging foundations, then open any product for full specifications." };

  return (
    <div className={styles.catalogBackdrop} role="presentation">
      <section className={styles.catalog} role="dialog" aria-modal="true" aria-labelledby="catalog-title">
        <header className={styles.catalogHeader}>
          <div><p className={styles.eyebrow}>Custom logo available</p><h2 id="catalog-title">{heading.title}</h2><p className={styles.catalogDescription}>{heading.description}</p></div>
          <button className={styles.catalogClose} type="button" aria-label="Close product catalog" onClick={onClose}><CloseIcon /></button>
        </header>
        <div className={styles.catalogGrid}>
          {visibleProducts.map((product) => (
            <button className={styles.catalogCard} type="button" key={product.id} onClick={() => onSelect(product)}>
              <span className={styles.catalogImage}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={product.image} alt={`${product.shortName} with customizable logo`} />
                {product.badge && <em>{product.badge}</em>}
              </span>
              <span className={styles.catalogMeta}><small>{product.category}</small><strong>{product.shortName}</strong><span>{product.price} · MOQ {product.moq}</span></span>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}
