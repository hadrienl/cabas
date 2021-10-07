import { FC, useEffect, useMemo } from 'react';

import Main from 'components/Main';
import Text from 'components/Text';
import {
  Distribution,
  Product,
  ProductInDistribution,
  Tag,
} from 'types/Entities';
import { useTranslation } from 'lib/i18n';
import Cards from 'components/Cards/Cards';
import ProductCard from 'components/Cards/Product';
import { useHeader } from 'components/Header/HeaderProvider';
import { getDistributionTimeRange } from 'lib/dates';

export interface TagViewProps {
  tag: Tag;
  products: (Product & {
    distributions: (Distribution & ProductInDistribution)[];
  })[];
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
  }, [tag, slug, setBreadcrumbs, t]);

  return (
    <Main>
      <Text as="h1">{t('tag.products.title', { tag })}</Text>
      <Cards>
        {products.map(({ distributions, ...product }) => {
          const currentDistribution = distributions.find(
            ({ startAt, closeAt }) =>
              getDistributionTimeRange(startAt, closeAt) === 'current'
          );
          return (
            <ProductCard
              key={product.id}
              {...product}
              distributed={currentDistribution}
            />
          );
        })}
      </Cards>
    </Main>
  );
};

export default TagView;
