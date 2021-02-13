export interface Provider {
  id: string;
  name: string;
  url: string;
  description: string;
}

export interface Product {
  id: string;
  name: string;
  provider?: Provider;
}
