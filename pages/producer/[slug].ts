import { GetStaticProps } from 'next';
import { getProducerById, getProducers } from 'resources/producers';
import { getBuyableProducts, getProducerProducts } from 'resources/products';
import { ProducerViewProps } from 'views/Producer/Producer';

export { default } from 'views/Producer/Producer';

export async function getStaticPaths() {
  const { producers } = await getProducers();

  return {
    paths: (producers || []).map(({ id, name }) => ({
      params: {
        slug: `${id}-${name}`,
      },
    })),
    fallback: false,
  };
}

export const getStaticProps: GetStaticProps<
  ProducerViewProps,
  { slug: string }
> = async ({ params: { slug = '' } = {} }) => {
  const [id] = slug.split(/-/);

  try {
    const producer = await getProducerById(id);
    const { products } = await getProducerProducts(producer.id);

    return {
      props: {
        producer,
        products: await getBuyableProducts(products),
      },
    };
  } catch (e) {
    return {
      notFound: true,
    };
  }
};
