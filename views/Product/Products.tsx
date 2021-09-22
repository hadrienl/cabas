import { FC, useEffect } from 'react';

import Box from 'components/Box';
import { useHeader } from 'components/Header/HeaderProvider';
import Main from 'components/Main';
import Text from 'components/Text';
import { useTranslation } from 'lib/i18n';
import { Product } from 'resources/types';
import Link from 'components/Link';
import slug from 'slug';

export interface ProductsViewProps {
  products: Pick<Product, 'id' | 'name'>[];
}
export const ProductsView: FC<ProductsViewProps> = ({ products }) => {
  const { t } = useTranslation();
  const { setBreadcrumbs } = useHeader();
  useEffect(() => {
    setBreadcrumbs([{ url: '/product', label: t('product.title') }]);

    return () => {
      setBreadcrumbs(null);
    };
  }, [setBreadcrumbs, t]);

  return (
    <Main>
      <Text as="h1">{t('product.title')}</Text>
      <Box my={4} as="ul">
        {products.map(({ id, name }) => (
          <Box key={id} as="li">
            <Link href={`/product/${id}-${slug(name)}`}>{name}</Link>
          </Box>
        ))}
      </Box>
    </Main>
  );
};

export default ProductsView;
