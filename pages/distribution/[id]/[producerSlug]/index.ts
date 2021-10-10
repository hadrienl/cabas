import supabase from 'lib/supabase';
import slugFn from 'slug';
import { GetStaticProps } from 'next';

import { ProducerInDistributionViewProps } from 'views/Distribution/Producer';
import { DistributedProduct } from 'types/Entities';

export { default } from 'views/Distribution/Producer';

export async function getStaticPaths() {
  return {
    paths: [],
    fallback: true,
  };
}

export const getStaticProps: GetStaticProps<
  ProducerInDistributionViewProps,
  { id: string; producerSlug: string }
> = async ({ params: { id = '', producerSlug = '' } = {} }) => {
  const [producerId, ...rest] = producerSlug.split(/-/);
  const producerName = rest.join('-');

  try {
    const { data: distribution } = await supabase
      .from('distribution')
      .select(
        `id,
        startAt: start_at,
        closeAt: close_at,
        shipAt: ship_at`
      )
      .eq('id', id)
      .single();

    if (!distribution) {
      throw new Error('not found');
    }

    const { data: producer } = await supabase
      .from('producer')
      .select(
        `id,
        name,
        description,
        photo`
      )
      .eq('id', producerId)
      .single();

    if (slugFn(producer.name) !== producerName) {
      return {
        redirect: {
          destination: `/distribution/${id}/${producerId}-${slugFn(
            producer.name
          )}`,
          permanent: true,
        },
      };
    }

    const { data: products } = await supabase
      .from<
        DistributedProduct & {
          distribution_id: number;
          producer_id: number;
        }
      >('available_products')
      .select(
        `id,
        name,
        description,
        photo,
        idInDistribution: id_in_distribution,
        price,
        unit,
        unitLabel: unit_label,
        perUnit: per_unit`
      )
      .eq('distribution_id', id)
      .eq('producer_id', producerId);

    return {
      props: {
        distribution,
        producer,
        products: products || [],
      },
    };
  } catch (e) {
    return {
      notFound: true,
    };
  }
};
