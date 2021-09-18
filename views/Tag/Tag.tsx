import { FC, useEffect, useMemo } from 'react';

import Main from 'components/Main';
import Text from 'components/Text';
import { Product, Tag } from 'resources/types';
import { useTranslation } from 'lib/i18n';
import Cards from 'components/Cards/Cards';
import ProductCard from 'components/Cards/Product';
import { useHeader } from 'components/Header/HeaderProvider';

export interface TagViewProps {
  tag: Tag;
  products: Product[];
}

export const TagView: FC<TagViewProps> = ({
  tag: { name: tag, slug },
  products,
}) => {
  const { t } = useTranslation();
  const { setBreadcrumbs } = useHeader();
  useEffect(() => {
    setBreadcrumbs([
      { url: '/tag', label: t('tag.title') },
      {
        url: `/tag/${slug}`,
        label: tag,
      },
    ]);
    return () => setBreadcrumbs(null);
  }, [tag, slug]);

  return (
    <Main>
      <Text as="h1">{t('tag.products.title', { tag })}</Text>
      <Cards>
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </Cards>
    </Main>
  );
};

export default TagView;
