export type ProductItem = {
  slug: string;
  title: string;
  material: string;
  note: string;
  price: string;
  sizes: string[];
  description: string;
  imageCount: number;
};

export type ProductCategory = {
  id: string;
  title: string;
  intro: string;
  items: ProductItem[];
};

export type ProductCatalog = ProductCategory[];
