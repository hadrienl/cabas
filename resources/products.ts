import supabase from 'lib/supabase';
import { Product } from './types';

export const getProducts = async () => {
  const { data = [], count } = await supabase
    .from('product')
    .select(`*, tag(*), producer(*)`);

  return {
    products: (data || []) as Product[],
    count,
  };
};

export const getProductById = async (id: string) => {
  const { data } = await supabase
    .from('product')
    .select(
      `id, name, description, photo, tag(slug, name), producer(id, name, description, photo)`
    )
    .eq('id', id)
    .single();

  if (!data) {
    throw new Error('not found');
  }

  return data as Product;
};

export const getProducerProducts = async (producerId: number) => {
  const { data = [], count } = await supabase
    .from('product')
    .select(`*, tag(*)`)
    .eq('fk_producer', producerId);

  return {
    products: (data || []) as Product[],
    count,
  };
};

export const getProductsByTag = async (
  tag: string | number,
  { withBuyable }: { withBuyable?: boolean } = {}
) => {
  const req = supabase.from('product').select(`*, tag(*)`);
  if (typeof tag === 'number') {
    req.eq('fk_tag', tag);
  }
  const { data = [], count } = await req;

  if (withBuyable && data && data.length > 0) {
    const now = new Date();
    const { data: { product: buyableProducts } = {} } = await supabase
      .from('distribution')
      .select('product(id)')
      .lt('start_at', now.toUTCString())
      .gte('close_at', now.toUTCString())
      .single();
    const buyableIds: number[] = buyableProducts.map(
      ({ id }: { id: number }) => id
    );
    data.forEach((product) => {
      product.isBuyable = buyableIds.includes(product.id);
    });
  }
  return {
    products: (data || []) as Product[],
    count,
  };
};

export const getBuyableProducts: {
  (products: Product): Promise<Product>;
  (products: Product[]): Promise<Product[]>;
} = async (products: any) => {
  const now = new Date();
  const { data = {} } = await supabase
    .from('distribution')
    .select(
      'product(id), product_in_distribution(unit, unitLabel: unit_label, perUnit: per_unit, price)'
    )
    .lt('start_at', now.toUTCString())
    .gte('close_at', now.toUTCString())
    .single();

  const buyableProducts = (data.product as { id: number }[]).reduce<
    Record<number, { price: number }>
  >((prev, { id }, key) => {
    return {
      ...prev,
      [id]: data.product_in_distribution[key],
    };
  }, {});

  if (Array.isArray(products)) {
    return products.map((product) => ({
      ...product,
      ...buyableProducts[product.id],
      isBuyable: Object.keys(buyableProducts).includes(`${product.id}`),
    }));
  }

  return {
    ...products,
    ...buyableProducts[products.id],
    isBuyable: Object.keys(buyableProducts).includes(`${products.id}`),
  };
};
