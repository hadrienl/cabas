import supabase from 'lib/supabase';
import slug from 'slug';
import { GetStaticProps } from 'next';

import { ProductInDistributionViewProps } from 'views/Distribution/Product';
import { DistributedProduct } from 'types/Entities';

export { default } from 'views/Distribution/Product';

export async function getStaticPaths() {
  return {
    paths: [],
    fallback: true,
  };
}

export const getStaticProps: GetStaticProps<
  ProductInDistributionViewProps,
  { id: string; producerSlug: string; productSlug: string }
> = async ({
  params: { id = '', producerSlug = '', productSlug = '' } = {},
}) => {
  const [producerId, ...producerRest] = producerSlug.split(/-/);
  const producerName = producerRest.join('-');

  const [productId, ...productRest] = productSlug.split(/-/);
  const productName = productRest.join('-');

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

    if (!producer) {
      throw new Error('not found');
    }

    if (slug(producer.name) !== producerName) {
      return {
        redirect: {
          destination: `/distribution/${id}/${producerId}-${slug(
            producer.name
          )}/${productId}-${slug(productName)}`,
          permanent: true,
        },
      };
    }

    const { data: product } = await supabase
      .from<
        DistributedProduct & {
          id_in_distribution: number;
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
        perUnit: per_unit,
        tag_name,
        tag_slug`
      )
      .eq('id_in_distribution', productId)
      .single();

    if (!product) {
      throw new Error('not found');
    }

    if (slug(product.name) !== productName) {
      return {
        redirect: {
          destination: `/distribution/${id}/${producerId}-${slug(
            producer.name
          )}/${product.id}-${slug(product.name)}`,
          permanent: true,
        },
      };
    }
    console.log(product);
    return {
      props: {
        distribution,
        producer,
        product,
      },
    };
  } catch (e) {
    return {
      notFound: true,
    };
  }
};
