import supabase from 'lib/supabase';
import slug from 'slug';
import { GetStaticProps } from 'next';

import { ProductViewProps } from 'views/Product/Product';
import {
  Distribution,
  ProductBase,
  ProductInDistribution,
} from 'resources/types';

export { default } from 'views/Product/Product';

export async function getStaticPaths() {
  const { data } = await await supabase.from('product').select(`id, name`);

  return {
    paths: (data || []).map(({ id, name }) => ({
      params: {
        slug: `${id}-${slug(name)}`,
      },
    })),
    fallback: false,
  };
}

export const getStaticProps: GetStaticProps<
  ProductViewProps,
  { slug: string }
> = async ({ params: { slug = '' } = {} }) => {
  const [id] = slug.split(/-/);

  try {
    const { data } = await supabase
      .from<
        ProductBase & {
          pid: (ProductInDistribution & {
            distribution: Distribution;
          })[];
        }
      >('product')
      .select(
        `id,
      name,
      description,
      photo,
      producer(id, name),
      tag(slug, name),
      pid: product_in_distribution(
        unit,
        unitLabel: unit_label,
        perUnit: per_unit,
        price,
        distribution(
          id,
          startAt: start_at,
          closeAt: close_at,
          shipAt: ship_at
        )
      )`
      )
      .eq('id', id)
      .single();

    if (!data) throw new Error('not found');

    const { pid = [], ...product } = data;
    return {
      props: {
        product: {
          ...product,
          distributions: pid.map(({ distribution, ...rest }) => ({
            ...distribution,
            ...rest,
          })),
        },
      },
    };
  } catch (e) {
    return {
      notFound: true,
    };
  }
};
