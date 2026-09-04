import { Clock3, Handshake, ShieldCheck, Sparkles, Truck } from "lucide-react";

import styles from "./PocketSite.module.css";

const benefits = [
  { icon: ShieldCheck, title: "Reliable Quality", text: "Sourced materials, consistent quality." },
  { icon: Clock3, title: "Fast Response", text: "Dedicated team with <1h response time." },
  { icon: Sparkles, title: "Full Customization", text: "Size, material, print and finishes — your way." },
  { icon: Truck, title: "On-Time Delivery", text: "100% on-time dispatch — we commit, we deliver." },
  { icon: Handshake, title: "Global Partnership", text: "Long-term support for your growing brand." },
];

export function PocketTrustStrip() {
  return (
    <section className={`${styles.trustStrip} ${styles.revealSection}`} aria-label="Why work with Luzhou Packaging">
      {benefits.map(({ icon: Icon, title, text }) => <div key={title}><Icon /><strong>{title}</strong><span>{text}</span></div>)}
    </section>
  );
}
