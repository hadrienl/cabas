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
  pid?: number;
  unit: ProductUnit;
  unitLabel: string;
  perUnit: number;
  price: number;
}

export interface Product extends ProductBase, ProductInDistribution {}

export interface ProductInBasket {
  unitPrice: number;
  quantity: number;
  price: number;
}

export enum BasketStatus {
  Pending = 0,
  Submitted = 1,
  Paid = 2,
  Validated = 3,
  Shipped = 4,
}
export interface Basket {
  status: BasketStatus;
  total: number;
  products?: (ProductBase & ProductInDistribution & ProductInBasket)[];
}

export interface DistributedProduct {
  id: number;
  name: string;
  description: string;
  photo: string;
  idInDistribution: number;
  price: number;
  unit: number;
  unitLabel: string;
  perUnit: number;
  distributionId: number;
  tagName: string;
  tagSlug: string;
}

export interface DistributedProductWithProducer extends DistributedProduct {
  producerId: number;
  producerName: string;
  producerDescription: string;
  producerPhoto: string;
}
