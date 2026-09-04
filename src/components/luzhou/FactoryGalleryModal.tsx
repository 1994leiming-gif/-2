"use client";

import { useEffect } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";

import { factoryMedia } from "@/data/luzhou-factory";

import { CloseIcon } from "./icons";
import styles from "./PocketSite.module.css";

export function FactoryGalleryModal({ activeIndex, onSelect, onClose }: { activeIndex: number | null; onSelect: (index: number) => void; onClose: () => void }) {
  const open = activeIndex !== null;

  useEffect(() => {
    if (!open) return;
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      if (event.key === "ArrowLeft" && activeIndex !== null) onSelect((activeIndex - 1 + factoryMedia.length) % factoryMedia.length);
      if (event.key === "ArrowRight" && activeIndex !== null) onSelect((activeIndex + 1) % factoryMedia.length);
    };
    document.body.dataset.factoryGalleryOpen = "true";
    window.addEventListener("keydown", handleKey);
    return () => {
      delete document.body.dataset.factoryGalleryOpen;
      window.removeEventListener("keydown", handleKey);
    };
  }, [activeIndex, onClose, onSelect, open]);

  if (!open || activeIndex === null) return null;
  const activeItem = factoryMedia[activeIndex];

  return (
    <div className={styles.factoryGalleryBackdrop} role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <section className={styles.factoryGallery} role="dialog" aria-modal="true" aria-labelledby="factory-gallery-title">
        <button className={styles.factoryGalleryClose} type="button" aria-label="Close factory gallery" onClick={onClose}><CloseIcon /></button>
        <div className={styles.factoryGalleryStage}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={activeItem.image} alt={activeItem.title} />
          <span>Real supplier photo · {String(activeIndex + 1).padStart(2, "0")}/{factoryMedia.length}</span>
        </div>
        <div className={styles.factoryGalleryContent}>
          <div>
            <p className={styles.eyebrow}>Inside our factory</p>
            <h2 id="factory-gallery-title">{activeItem.title}</h2>
            <p>{activeItem.description}</p>
          </div>
          <div className={styles.factoryGalleryArrows}>
            <button type="button" aria-label="Previous factory image" onClick={() => onSelect((activeIndex - 1 + factoryMedia.length) % factoryMedia.length)}><ArrowLeft /></button>
            <button type="button" aria-label="Next factory image" onClick={() => onSelect((activeIndex + 1) % factoryMedia.length)}><ArrowRight /></button>
          </div>
        </div>
        <div className={styles.factoryThumbnails} aria-label="Factory image thumbnails">
          {factoryMedia.map((item, index) => (
            <button type="button" key={item.title} aria-label={`View ${item.title}`} aria-current={index === activeIndex} onClick={() => onSelect(index)}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={item.image} alt="" />
              <span>{item.title}</span>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}
