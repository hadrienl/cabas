import supabase from 'lib/supabase';
import { GetStaticProps } from 'next';

import { TagViewProps } from 'views/Tag/Tag';
import { DistributedProductWithProducer, Tag } from 'types/Entities';

export { default } from 'views/Tag/Tag';

export async function getStaticPaths() {
  const { data: allTags } = await supabase.from<Tag>('tag').select('slug');

  return {
    paths: (allTags || []).map(({ slug }) => `/tags/${slug}`),
    fallback: false,
  };
}

export const getStaticProps: GetStaticProps<
  TagViewProps,
  { id: string; slug: string }
> = async ({ params: { id = '', slug = '' } = {} }) => {
  try {
    const { data: tag } = await supabase
      .from<Tag>('tag')
      .select(
        `id,
        slug,
        name`
      )
      .eq('slug', slug)
      .single();

    if (!tag) {
      throw new Error('not found');
    }

    const { data: products } = await supabase
      .from<
        DistributedProductWithProducer & {
          tag_slug: string;
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
      perUnit: per_unit,
      distributionId: distribution_id,
      producerId: producer_id,
      producerName: producer_name,
      producerDescription: producer_description,
      producerPhoto: producer_photo,
      tagName: tag_name,
      tagSlug: tag_slug`
      )
      .eq('tag_slug', slug);

    return {
      props: {
        tag,
        products: products || [],
      },
    };
  } catch (e) {
    return {
      notFound: true,
    };
  }
};
