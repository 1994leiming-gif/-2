"use client";

import { useCallback, useEffect, useState } from "react";

import type { PocketCatalogFilter, PocketProduct } from "@/types/luzhou";

import { PocketCollections } from "./PocketCollections";
import { PocketCompany } from "./PocketCompany";
import { PocketConversionFooter } from "./PocketConversionFooter";
import { PocketHero } from "./PocketHero";
import { PocketNavigation } from "./PocketNavigation";
import { PocketProcess } from "./PocketProcess";
import { PocketTrustStrip } from "./PocketTrustStrip";
import { ProductCatalogModal } from "./ProductCatalogModal";
import { ProductModal } from "./ProductModal";
import { FactoryGalleryModal } from "./FactoryGalleryModal";
import styles from "./PocketSite.module.css";

export function PocketExperience() {
  const [catalogOpen, setCatalogOpen] = useState(false);
  const [catalogFilter, setCatalogFilter] = useState<PocketCatalogFilter | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<PocketProduct | null>(null);
  const [factoryIndex, setFactoryIndex] = useState<number | null>(null);
  const closeCatalog = useCallback(() => setCatalogOpen(false), []);
  const closeProduct = useCallback(() => {
    setSelectedProduct(null);
    setCatalogOpen(true);
  }, []);
  const selectProduct = useCallback((product: PocketProduct) => {
    setCatalogOpen(false);
    setSelectedProduct(product);
  }, []);

  useEffect(() => {
    const root = document.querySelector(`.${styles.page}`);
    const sections = root?.querySelectorAll(`.${styles.revealSection}`) ?? [];
    if (!("IntersectionObserver" in window)) {
      sections.forEach((section) => section.setAttribute("data-visible", "true"));
      return;
    }
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.setAttribute("data-visible", "true");
          observer.unobserve(entry.target);
        }
      });
    }, { rootMargin: "0px 0px -8%", threshold: 0.06 });
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  const openCatalog = useCallback((filter?: PocketCatalogFilter) => {
    setCatalogFilter(filter ?? null);
    setCatalogOpen(true);
  }, []);

  return (
    <main className={`luzhou-page-root ${styles.page}`}>
      <PocketNavigation onOpenCatalog={openCatalog} />
      <PocketHero onOpenCatalog={openCatalog} />
      <PocketCollections onOpenCatalog={openCatalog} />
      <PocketCompany onOpenFactory={setFactoryIndex} />
      <PocketProcess onOpenFactory={setFactoryIndex} />
      <PocketTrustStrip />
      <PocketConversionFooter onOpenCatalog={openCatalog} />
      <ProductCatalogModal open={catalogOpen} filter={catalogFilter} onClose={closeCatalog} onSelect={selectProduct} />
      <ProductModal product={selectedProduct} onClose={closeProduct} />
      <FactoryGalleryModal activeIndex={factoryIndex} onSelect={setFactoryIndex} onClose={() => setFactoryIndex(null)} />
    </main>
  );
}
