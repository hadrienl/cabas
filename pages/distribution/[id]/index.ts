import { GetStaticProps } from 'next';

import supabase from 'lib/supabase';
import { DistributionViewProps } from 'views/Distribution/Distribution';
import { Distribution } from 'types/Entities';
import { getDistributionTimeRange } from 'lib/dates';

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
  const { data: distribution } = await supabase
    .from<Distribution>('distribution')
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

  if (
    getDistributionTimeRange(distribution.startAt, distribution.closeAt) ===
    'current'
  ) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }
  return {
    props: {
      distribution,
    },
  };
};
