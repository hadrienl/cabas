import supabase from 'lib/supabase';
import slugFn from 'slug';
import { GetStaticProps } from 'next';

import { ProductInDistributionViewProps } from 'views/Distribution/Product';
import { Distribution, Product, ProductInDistribution } from 'types/Entities';

export { default } from 'views/Distribution/Product';

export async function getStaticPaths() {
  return {
    paths: [],
    fallback: true,
  };
}

export const getStaticProps: GetStaticProps<
  ProductInDistributionViewProps,
  { id: string; slug: string }
> = async ({ params: { id = '', slug = '' } = {} }) => {
  const [productId, ...rest] = slug.split(/-/);
  const productName = rest.join('-');

  try {
    const { data } = await supabase
      .from<
        Product & {
          ['pid.fk_distribution']: string;
          pid: (ProductInDistribution & { distribution: Distribution })[];
        }
      >('product')
      .select(
        `id,
        name,
        description,
        photo,
        producer(id, name),
        tag(name, slug),
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
      .eq('id', productId)
      .eq('pid.fk_distribution', id)
      .single();

    if (!data) {
      throw new Error('not found');
    }

    if (slugFn(data.name) !== productName) {
      return {
        redirect: {
          destination: `/distribution/${id}/${data.id}-${slugFn(data.name)}`,
          permanent: true,
        },
      };
    }

    const { pid, ...product } = data;
    const { distribution, ...prices } = pid[0];
    return {
      props: {
        product: {
          ...product,
          ...prices,
        },
        distribution,
      },
    };
  } catch (e) {
    return {
      notFound: true,
    };
  }
};
