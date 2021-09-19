import supabase from 'lib/supabase';
import { Distribution } from './types';

export const getDistributions = async () => {
  const { data = [], count } = await supabase.from('distribution').select(
    `id,
    start_at,
    close_at,
    ship_at,
    products: product_in_distribution(
      product(
        id,
        name,
        description,
        photo,
        unit,
        producer(id, name),
        tag(*)
      ),
      price
    )
    `
  );

  return {
    distributions: (data || []).map<Distribution>(
      ({ products, start_at, close_at, ship_at, ...distribution }) => ({
        ...distribution,
        startAt: start_at,
        closeAt: close_at,
        shipAt: ship_at,
        products: products.map(({ product, ...rest }: any) => ({
          ...product,
          ...rest,
        })),
      })
    ),
    count,
  };
};
