import { GetStaticProps } from 'next';
import { getProductsByTag } from 'resources/products';
import { getTagBySlug, getTags } from 'resources/tags';
import { TagViewProps } from 'views/Tag/Tag';

export { default } from 'views/Tag/Tag';

export async function getStaticPaths() {
  const { tags } = await getTags();

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
      const tag = await getTagBySlug(slug);
      const { products } = await getProductsByTag(tag.id, {
        withBuyable: true,
      });

      return {
        props: {
          tag,
          products,
        },
      };
    } catch (e) {
      return {
        notFound: true,
      };
    }
  };
