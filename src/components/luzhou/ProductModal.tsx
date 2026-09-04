"use client";

import { useEffect } from "react";

import type { PocketProduct } from "@/types/luzhou";

import { ArrowIcon, CloseIcon } from "./icons";
import styles from "./PocketSite.module.css";

export function ProductModal({ product, onClose }: { product: PocketProduct | null; onClose: () => void }) {
  useEffect(() => {
    if (!product) return;
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.body.dataset.pocketModalOpen = "true";
    window.addEventListener("keydown", handleKey);
    return () => {
      delete document.body.dataset.pocketModalOpen;
      window.removeEventListener("keydown", handleKey);
    };
  }, [onClose, product]);

  if (!product) return null;

  return (
    <div className={styles.modalBackdrop} role="presentation" onMouseDown={(event) => {
      if (event.target === event.currentTarget) onClose();
    }}>
      <section className={styles.productModal} role="dialog" aria-modal="true" aria-labelledby="product-dialog-title">
        <button className={styles.modalClose} type="button" aria-label="Close product details" onClick={onClose}><CloseIcon /></button>
        <div className={styles.modalImage}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={product.image} alt={product.shortName} />
        </div>
        <div className={styles.modalContent}>
          <p className={styles.eyebrowDark}>{product.category} · Product {product.id}</p>
          <h2 id="product-dialog-title">{product.shortName}</h2>
          <p className={styles.modalDescription}>{product.name}</p>
          <div className={styles.modalPrice}><strong>{product.price}</strong><span>MOQ {product.moq}</span></div>
          <dl className={styles.specList}>
            {product.specifications.map((specification) => (
              <div key={`${product.id}-${specification.label}`}><dt>{specification.label}</dt><dd>{specification.value}</dd></div>
            ))}
          </dl>
          <p className={styles.disclaimer}>Final material, dimensions, price, lead time and certification are confirmed with the supplier on Alibaba.</p>
          <a className={styles.darkButton} href={product.url} target="_blank" rel="noreferrer">Request quote on Alibaba <ArrowIcon /></a>
        </div>
      </section>
    </div>
  );
}
