export interface PocketProduct {
  id: string;
  name: string;
  shortName: string;
  category: string;
  image: string;
  price: string;
  moq: string;
  url: string;
  badge?: string;
  specifications: Array<{
    label: string;
    value: string;
  }>;
}

export interface PocketCollection {
  name: string;
  description: string;
  image: string;
  url: string;
}

export type PocketCatalogFilter = "non-woven" | "paper-gift" | "flexible";
