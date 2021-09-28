import { FC, useEffect } from 'react';
import slug from 'slug';

import { Link as ILink, useHeader } from 'components/Header/HeaderProvider';
import Main from 'components/Main';
import { useTranslation } from 'lib/i18n';
import { Distribution, Product, ProductInDistribution } from 'types/Entities';
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
  product: Product & ProductInDistribution;
  distribution: Distribution;
}

export const ProductInDistributionView: FC<ProductInDistributionViewProps> = ({
  product,
  product: { id, name, description, photo, price, unit, producer, tag },
  distribution,
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
        producer && {
          url: `/producer/${producer.id}-${slug(producer.name)}`,
          label: producer.name,
        },
        {
          url: `/product/${id}-${slug(name)}`,
          label: name,
        },
      ].filter(Boolean) as ILink[]
    );

    return () => setBreadcrumbs(null);
  }, [producer, id, setBreadcrumbs, t, distribution.id, name]);

  return (
    <Main>
      <Box flexDirection="row" justifyContent="space-between">
        <Text as="h1">{name}</Text>
        {tag && <Link href={`/tag/${tag.slug}`}>{tag.name}</Link>}
      </Box>
      <Box flexDirection="row" my={4}>
        {photo && (
          <Box mr={2} width="40%">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <Box
              as="img"
              src={photo}
              alt={name}
              width="100%"
              alignSelf="start"
            />
          </Box>
        )}
        <Box ml={photo ? 2 : 0} flex="1">
          <Markdown flex="1">{description}</Markdown>
          {distributionRange === 'current' && <AddToBasket {...product} />}
          {distributionRange !== 'current' && (
            <>
              <Text fontSize={4}>
                {t('distributions.product.price', {
                  price: numberFormat(price, {
                    style: 'currency',
                    currency: 'EUR',
                  }),
                  context: `${unit}`,
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
