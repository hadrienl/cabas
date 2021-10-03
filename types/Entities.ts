export interface Customer {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  photo: string;
  phone: string;
}

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
  None = 0,
  Piece = 1,
  Kg = 2,
  Liter = 3,
}

export interface ProductBase {
  id: number;
  name: string;
  photo: string;
  description: string;
  producer?: Producer;
  tag?: Tag;
}

export interface Distribution {
  id: number;
  startAt: string;
  closeAt: string;
  shipAt: string;
}

export interface ProductInDistribution {
  unit: ProductUnit;
  unitLabel: string;
  perUnit: number;
  price: number;
}

export interface ProductWithDistributions extends ProductBase {
  distributions: (Distribution & ProductInDistribution)[];
}

export interface Product extends ProductBase, ProductInDistribution {}
