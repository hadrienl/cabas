import supabase from 'lib/supabase';
import { Distribution } from './types';

export const getDistributions = async () => {
  const { data = [], count } = await supabase.from('distribution').select(
    `id,
    startAt: start_at,
    closeAt: close_at,
    shiptAt: ship_at,
    products: product_in_distribution(
      id,
      unit,
      unitLabel: unit_label,
      perUnit: per_unit,
      price,
      product(
        name,
        description,
        photo,
        producer(id, name),
        tag(slug, name)
      )
    )
    `
  );

  return {
    distributions: (data || []).map<Distribution>(
      ({ products, ...distribution }) => ({
        ...distribution,
        products: products.map(({ product, ...rest }: any) => ({
          ...product,
          ...rest,
        })),
      })
    ),
    count,
  };
};
