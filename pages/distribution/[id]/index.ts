import { GetStaticProps } from 'next';

import supabase from 'lib/supabase';
import { DistributionViewProps } from 'views/Distribution/Distribution';
import { Distribution, Producer } from 'types/Entities';

export { default } from 'views/Distribution/Distribution';

export async function getStaticPaths() {
  const { data: distributions } = await supabase
    .from<Distribution>('distribution')
    .select('id');
  return {
    paths: (distributions || []).map(({ id }) => `/distribution/${id}`),
    fallback: false,
  };
}

export const getStaticProps: GetStaticProps<
  DistributionViewProps,
  { id: string }
> = async ({ params: { id = '' } = {} }) => {
  const { data } = await supabase
    .from<
      Distribution & {
        products: {
          producer: Producer;
        }[];
      }
    >('distribution')
    .select(
      `id,
      startAt: start_at,
      closeAt: close_at,
      shipAt: ship_at,
      products: product(producer(*))`
    )
    .eq('id', id)
    .single();

  if (!data) {
    throw new Error('not found');
  }
  const { products, ...distribution } = data;
  const producers = products
    .map(({ producer }) => producer)
    .reduce<Producer[]>((prev, producer) => {
      if (prev.find(({ id }) => producer.id === id)) return prev;
      return [...prev, producer];
    }, []);

  return {
    props: {
      distribution,
      producers,
    },
  };
};
