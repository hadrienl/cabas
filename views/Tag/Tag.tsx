import { FC, useEffect } from 'react';
import slug from 'slug';

import Main from 'components/Main';
import Text from 'components/Text';
import { DistributedProductWithProducer, Tag } from 'types/Entities';
import { useTranslation } from 'lib/i18n';
import Cards from 'components/Cards/Cards';
import ProductCard from 'components/Cards/Product';
import { useHeader } from 'components/Header/HeaderProvider';

export interface TagViewProps {
  tag: Tag;
  products: DistributedProductWithProducer[];
}

export const TagView: FC<TagViewProps> = ({ tag, products = [] }) => {
  const { t } = useTranslation();
  const { setBreadcrumbs } = useHeader();
  useEffect(() => {
    setBreadcrumbs([
      { url: '/tags', label: t('tag.title') },
      {
        url: `/tag/${tag.slug}`,
        label: tag.name,
      },
    ]);
    return () => setBreadcrumbs(null);
  }, [tag, setBreadcrumbs, t]);

  return (
    <Main>
      <Text as="h1">{t('tag.products.title', { tag: tag.name })}</Text>
      <Cards>
        {products.map((product) => {
          return (
            <ProductCard
              key={product.id}
              {...product}
              link={`/distribution/${product.distributionId}/${
                product.producerId
              }-${slug(product.producerName)}/${
                product.idInDistribution
              }-${slug(product.name)}`}
            />
          );
        })}
      </Cards>
    </Main>
  );
};

export default TagView;
