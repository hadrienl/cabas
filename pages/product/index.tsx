import { GetStaticProps } from 'next';
import { getProducts } from 'resources/products';
import { ProductsViewProps } from 'views/Product/Products';

export { default } from 'views/Product/Products';

export const getStaticProps: GetStaticProps<ProductsViewProps> = async () => {
  const { products } = await getProducts();
  return {
    props: {
      products,
    },
  };
};
