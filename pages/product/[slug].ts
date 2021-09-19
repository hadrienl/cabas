import { GetStaticProps } from 'next';

import {
  getBuyableProducts,
  getProductById,
  getProducts,
} from 'resources/products';
import { ProductViewProps } from 'views/Product/Product';

export { default } from 'views/Product/Product';

export async function getStaticPaths() {
  const { products } = await getProducts();

  return {
    paths: (products || []).map(({ id, name }) => ({
      params: {
        slug: `${id}-${name}`,
      },
    })),
    fallback: false,
  };
}

export const getStaticProps: GetStaticProps<
  ProductViewProps,
  { slug: string }
> = async ({ params: { slug = '' } = {} }) => {
  const [id] = slug.split(/-/);

  try {
    const product = await getBuyableProducts(await getProductById(id));

    return {
      props: {
        product,
      },
    };
  } catch (e) {
    return {
      notFound: true,
    };
  }
};
