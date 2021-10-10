import { getDistributionTimeRange } from 'lib/dates';
import supabase from 'lib/supabase';
import { GetStaticProps } from 'next';
import slugFn from 'slug';

import {
  Distribution,
  Producer,
  Product,
  ProductInDistribution,
} from 'types/Entities';
import { ProducerViewProps } from 'views/Producer/Producer';

export { default } from 'views/Producer/Producer';

export async function getStaticPaths() {
  const { data: producers } = await supabase
    .from<Pick<Producer, 'id' | 'name'>>('producer')
    .select('id, name');

  return {
    paths: (producers || []).map(({ id, name }) => ({
      params: {
        slug: `${id}-${slugFn(name)}`,
      },
    })),
    fallback: true,
  };
}

export const getStaticProps: GetStaticProps<
  ProducerViewProps,
  { slug: string }
> = async ({ params: { slug = '' } = {} }) => {
  const [id, ...rest] = slug.split(/-/);
  const slugName = rest.join('-');

  try {
    const { data: producer } = await supabase
      .from<Producer>('producer')
      .select('id, name, description, photo')
      .eq('id', id)
      .single();

    if (!producer) {
      throw new Error('not found');
    }

    if (slugName !== slugFn(producer.name)) {
      return {
        redirect: {
          destination: `/producer/${id}-${slugFn(producer.name)}`,
          permanent: true,
        },
      };
    }
    const { data } = await supabase
      .from<
        Product & {
          distributions: Distribution[];
          pid: (ProductInDistribution & {
            fk_distribution: number;
          })[];
          fk_producer: number;
        }
      >('product')
      .select(
        `id,
        name,
        description,
        photo,
        tag(slug, name),
        distributions: distribution(
          id,
          startAt: start_at,
          closeAt: close_at,
          shipAt: ship_at
        ),
        pid: product_in_distribution(
          pid: id,
          fk_distribution,
          unit,
          unitLabel: unit_label,
          perUnit: per_unit,
          price
        )`
      )
      .eq('fk_producer', id);

    const products = (data || []).reduce<ProducerViewProps['products']>(
      (prev, { distributions, pid, fk_producer, ...product }) => {
        return [
          ...prev,
          ...pid.map(({ fk_distribution, pid, ...rest }) => ({
            ...product,
            pid,
            distribution: {
              ...distributions.find(({ id }) => fk_distribution === id)!,
              ...rest,
            },
          })),
        ];
      },
      []
    );

    products.sort((pA, pB) => {
      const pAIsInCurrent =
        getDistributionTimeRange(
          pA.distribution.startAt,
          pA.distribution.closeAt
        ) === 'current';
      const pBIsInCurrent =
        getDistributionTimeRange(
          pB.distribution.startAt,
          pB.distribution.closeAt
        ) === 'current';

      if (pAIsInCurrent && pBIsInCurrent) return 0;
      if (pAIsInCurrent) return -1;
      if (pBIsInCurrent) return 1;
      return 0;
    });
    //console.log(products[0].distributions);
    return {
      props: {
        producer,
        products,
      },
    };
  } catch (e) {
    return {
      notFound: true,
    };
  }
};
