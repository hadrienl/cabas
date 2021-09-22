import { GetStaticProps } from 'next';

import supabase from 'lib/supabase';
import { ProductsViewProps } from 'views/Product/Products';
import { Distribution, Product } from 'resources/types';

export { default } from 'views/Product/Products';

export const getStaticProps: GetStaticProps<ProductsViewProps> = async () => {
  const { data } = await supabase
    .from<
      Pick<Product, 'id' | 'name'> & {
        pid: {
          id: number;
          distribution: Pick<Distribution, 'id' | 'startAt' | 'closeAt'>;
        }[];
      }
    >('product')
    .select(
      `id,
      name`
    );

  return {
    props: {
      products: data || [],
    },
  };
};
