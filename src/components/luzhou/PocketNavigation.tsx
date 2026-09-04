"use client";

import { useEffect, useState } from "react";
import { ChevronDown, ExternalLink } from "lucide-react";

import { alibabaStoreUrl, collections } from "@/data/luzhou-products";
import type { PocketCatalogFilter } from "@/types/luzhou";

import { MenuIcon } from "./icons";
import styles from "./PocketSite.module.css";

const collectionFilters: PocketCatalogFilter[] = ["non-woven", "paper-gift", "flexible"];

export function PocketNavigation({ onOpenCatalog }: { onOpenCatalog: (filter?: PocketCatalogFilter) => void }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 16);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  const openCatalog = () => {
    setMenuOpen(false);
    onOpenCatalog();
  };

  return (
    <header className={styles.navigation} data-scrolled={scrolled}>
      <a className={styles.wordmark} href="#top" aria-label="Luzhou Packaging home">
        <span>luzhou</span><span>packaging</span>
      </a>
      <nav className={styles.desktopNav} aria-label="Primary navigation">
        <div className={styles.shopMenu}>
          <button type="button" onClick={() => onOpenCatalog()}>Products <ChevronDown className={styles.navChevron} /></button>
          <div className={styles.shopDropdown}>
            <button type="button" onClick={() => onOpenCatalog()}>All products</button>
            {collections.map((collection, index) => (
              <button key={collection.name} type="button" onClick={() => onOpenCatalog(collectionFilters[index])}>{collection.name}</button>
            ))}
          </div>
        </div>
        <a href="#company">Company <ChevronDown className={styles.navChevron} /></a>
        <a href="#process">Capabilities <ChevronDown className={styles.navChevron} /></a>
        <a href="#process">Process</a>
      </nav>
      <a className={styles.headerCta} href={alibabaStoreUrl} target="_blank" rel="noreferrer">
        Alibaba store <ExternalLink />
      </a>
      <button className={styles.mobileMenuButton} type="button" aria-label={menuOpen ? "Close navigation" : "Open navigation"} aria-expanded={menuOpen} onClick={() => setMenuOpen((current) => !current)}>
        <MenuIcon open={menuOpen} />
      </button>
      <nav className={styles.mobileNav} aria-label="Mobile navigation" data-open={menuOpen}>
        <button type="button" onClick={openCatalog}>Products</button>
        <a href="#company" onClick={() => setMenuOpen(false)}>Company</a>
        <a href="#process" onClick={() => setMenuOpen(false)}>Capabilities</a>
        <a href="#process" onClick={() => setMenuOpen(false)}>Process</a>
        <a href={alibabaStoreUrl} target="_blank" rel="noreferrer">Alibaba store <ExternalLink /></a>
      </nav>
    </header>
  );
}
