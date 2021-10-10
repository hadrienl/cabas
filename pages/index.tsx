import supabase from 'lib/supabase';
import { GetStaticProps } from 'next';
import { DistributedProductWithProducer } from 'types/Entities';

import { HomeViewProps } from 'views/Home/Home';

export { default } from 'views/Home/Home';

export const getStaticProps: GetStaticProps<HomeViewProps> = async () => {
  const { data: distribution } = await supabase
    .from('current_distribution')
    .select(
      `id,
      startAt: start_at,
      closeAt: close_at,
      shipAt: ship_at
    `
    )
    .single();

  const { data: futureDistributions } = await supabase
    .from('future_distributions')
    .select(
      `id,
      startAt: start_at,
      closeAt: close_at,
      shipAt: ship_at
    `
    );

  const { data: products } = await supabase
    .from<DistributedProductWithProducer>('available_products')
    .select(
      `id,
      name,
      description,
      photo,
      idInDistribution: id_in_distribution,
      price,
      unit,
      perUnit: per_unit,
      distributionId: distribution_id,
      producerId: producer_id,
      producerName: producer_name,
      producerDescription: producer_description,
      producerPhoto: producer_photo`
    );

  return {
    props: {
      distribution,
      futureDistributions: futureDistributions || [],
      products: products || [],
    },
  };
};
