export interface Tag {
  id: number;
  slug: string;
  name: string;
}

export interface Producer {
  id: number;
  name: string;
  description: string;
  photo?: string;
}

export enum ProductUnit {
  Piece = 1,
  Kg = 2,
  Liter = 3,
}
export interface Product {
  id: number;
  name: string;
  photo: string;
  description: string;
  price: number;
  unit: ProductUnit;
  isBuyable?: boolean;
  producer?: Producer;
  tag?: Tag;
}

export interface Distribution {
  id: number;
  startAt: string;
  closeAt: string;
  shipAt: string;
  products: Product[];
}
