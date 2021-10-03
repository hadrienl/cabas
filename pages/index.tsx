import supabase from 'lib/supabase';
import { GetStaticProps } from 'next';

import { Distribution, Producer } from 'types/Entities';
import { HomeViewProps } from 'views/Home/Home';

export { default } from 'views/Home';

export const getStaticProps: GetStaticProps<HomeViewProps> = async () => {
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
    products: product(
      producer(id, name, description, photo)
    )`
    );

  const distributions = (data || []).map(({ products, ...distribution }) => ({
    ...distribution,
    producers: products
      .map(({ producer }) => producer)
      .reduce<Producer[]>((prev, producer) => {
        if (prev.find(({ id }) => producer.id === id)) return prev;
        return [...prev, producer];
      }, []),
  }));

  return {
    props: {
      distributions,
    },
  };
};
