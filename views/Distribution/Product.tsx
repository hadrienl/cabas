import { FC, useEffect } from 'react';
import slug from 'slug';

import { Link as ILink, useHeader } from 'components/Header/HeaderProvider';
import Main from 'components/Main';
import { useTranslation } from 'lib/i18n';
import {
  DistributedProduct,
  Distribution,
  Producer,
  Product,
  ProductInDistribution,
} from 'types/Entities';
import Loading from 'views/Common/Loading';
import Box from 'components/Box';
import Text from 'components/Text';
import Link from 'components/Link';
import Markdown from 'components/Markdown';
import { getDistributionTimeRange } from 'lib/dates';
import AddToBasket from 'components/AddToBasket';
import useNumberFormat from 'lib/useNumberFormat';
import useDateFormat from 'lib/useDateFormat';

export interface ProductInDistributionViewProps {
  distribution: Distribution;
  producer: Producer;
  product: DistributedProduct;
}

export const ProductInDistributionView: FC<ProductInDistributionViewProps> = ({
  distribution,
  producer,
  product,
}) => {
  const { t } = useTranslation();
  const dateFormat = useDateFormat();
  const numberFormat = useNumberFormat();
  const { setBreadcrumbs } = useHeader();
  const distributionRange = getDistributionTimeRange(
    distribution.startAt,
    distribution.closeAt
  );

  useEffect(() => {
    setBreadcrumbs(
      [
        {
          url: `/distribution/${distribution.id}`,
          label: t(`distributions.${distributionRange}`),
        },
        {
          url: `/distribution/${distribution.id}/${producer.id}-${slug(
            producer.name
          )}`,
          label: producer.name,
        },
        {
          url: `/distribution/${distribution.id}/${producer.id}-${slug(
            producer.name
          )}/${product.id}-${slug(product.name)}`,
          label: product.name,
        },
      ].filter(Boolean) as ILink[]
    );

    return () => setBreadcrumbs(null);
  }, [
    distribution.id,
    distributionRange,
    producer.id,
    producer.name,
    product.id,
    product.name,
    setBreadcrumbs,
    t,
  ]);

  return (
    <Main>
      <Box flexDirection="row" justifyContent="space-between">
        <Text as="h1">{product.name}</Text>
        {product.tagName && (
          <Link href={`/tag/${product.tagSlug}`}>{product.tagName}</Link>
        )}
      </Box>
      <Box flexDirection="row" my={4}>
        {product.photo && (
          <Box mr={2} width="40%">
            <Box
              as="img"
              src={product.photo}
              alt={product.name}
              width="100%"
              alignSelf="start"
            />
          </Box>
        )}
        <Box ml={product.photo ? 2 : 0} flex="1">
          <Markdown flex="1">{product.description}</Markdown>
          {distributionRange === 'current' && <AddToBasket {...product} />}
          {distributionRange !== 'current' && (
            <>
              <Text fontSize={4}>
                {t('distributions.product.price', {
                  price: numberFormat(product.price, {
                    style: 'currency',
                    currency: 'EUR',
                  }),
                  context: `${product.unit}`,
                })}
              </Text>
              <Text>
                {t(`product.distributed.${distributionRange}`, {
                  startAt: dateFormat(distribution.startAt, {
                    dateStyle: 'full',
                  }),
                  closeAt: dateFormat(distribution.closeAt, {
                    dateStyle: 'full',
                  }),
                })}
              </Text>
              {/*<Text>
                Me le rapeller (TODO : mettre un bouton d'inscription à la NL)
              </Text>*/}
            </>
          )}
        </Box>
      </Box>
    </Main>
  );
};

const ProductInDistributionViewWithLoading = (
  props: ProductInDistributionViewProps
) => (
  <Loading>
    <ProductInDistributionView {...props} />
  </Loading>
);

export default ProductInDistributionViewWithLoading;
