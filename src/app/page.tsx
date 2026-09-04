import type { Metadata } from "next";

import { PocketExperience } from "@/components/luzhou/PocketExperience";

export const metadata: Metadata = {
  title: "Luzhou Packaging | Custom Bags & Branded Packaging",
  description: "Custom non-woven, paper, gift and flexible packaging from Luzhou Packaging. Explore real supplier products and request a quote through Alibaba.",
  icons: { icon: "/luzhou/favicon.svg" },
  openGraph: {
    title: "Luzhou Packaging | Custom Bags & Branded Packaging",
    description: "Custom bags and branded packaging, developed around your artwork, dimensions and market.",
    images: ["/luzhou/design-v2/hero-packaging.webp"],
  },
};

export default function LuzhouPage() {
  return <PocketExperience />;
}
