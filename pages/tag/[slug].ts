import supabase from 'lib/supabase';
import { GetStaticProps } from 'next';

import {
  Distribution,
  Product,
  ProductInDistribution,
  Tag,
} from 'types/Entities';
import { TagViewProps } from 'views/Tag/Tag';

export { default } from 'views/Tag/Tag';

export async function getStaticPaths() {
  const { data: tags } = await supabase.from('tag').select('slug');

  return {
    paths: (tags || []).map(({ slug }) => ({
      params: {
        slug,
      },
    })),
    fallback: false,
  };
}

export const getStaticProps: GetStaticProps<TagViewProps, { slug: string }> =
  async ({ params: { slug = '' } = {} }) => {
    try {
      const { data: tag } = await supabase
        .from<Tag>('tag')
        .select('*')
        .eq('slug', slug)
        .single();

      if (!tag) {
        throw new Error('not found');
      }

      const { data: products } = await supabase
        .from<
          Product & {
            fk_tag: number;
            pid: (ProductInDistribution & {
              fk_distribution: number;
            })[];
            distributions: Distribution[];
          }
        >('product')
        .select(
          `*,
          tag(*),
          distributions: distribution(
            id,
            startAt: start_at,
            closeAt: close_at,
            shipAt: ship_at
          ),
          pid: product_in_distribution(
            fk_distribution,
            unit,
            unitLabel: unit_label,
            perUnit: per_unit,
            price
          )`
        )
        .eq('fk_tag', tag.id);

      return {
        props: {
          tag,
          products: (products || []).map(
            ({ distributions, pid, ...product }) => {
              return {
                ...product,
                distributions: distributions.map(({ id, ...d }) => {
                  const { fk_distribution, ...relatedPid } = pid.find(
                    ({ fk_distribution }) => fk_distribution === id
                  )!;
                  return {
                    id,
                    ...d,
                    ...relatedPid,
                  };
                }),
              };
            }
          ),
        },
      };
    } catch (e) {
      return {
        notFound: true,
      };
    }
  };
