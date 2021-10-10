import { FC, useEffect } from 'react';
import slug from 'slug';

import { Link as ILink, useHeader } from 'components/Header/HeaderProvider';
import Main from 'components/Main';
import { useTranslation } from 'lib/i18n';
import { DistributedProduct, Distribution, Producer } from 'types/Entities';
import Loading from 'views/Common/Loading';
import Box from 'components/Box';
import Text from 'components/Text';
import Markdown from 'components/Markdown';
import { getDistributionTimeRange } from 'lib/dates';
import Cards from 'components/Cards/Cards';
import ProductCard from 'components/Cards/Product';

export interface ProducerInDistributionViewProps {
  distribution: Distribution;
  producer: Producer;
  products: DistributedProduct[];
}

export const ProducerInDistributionView: FC<ProducerInDistributionViewProps> =
  ({ distribution, producer, products }) => {
    const { t } = useTranslation();
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
            url: `/distribution/${distribution.id}/${producer.id}-${slug(
              producer.name
            )}`,
            label: producer.name,
          },
        ].filter(Boolean) as ILink[]
      );

      return () => setBreadcrumbs(null);
    }, [producer, setBreadcrumbs, t, distribution.id, distributionRange]);

    return (
      <Main>
        <Box flexDirection="row" justifyContent="space-between">
          <Text as="h1">{producer.name}</Text>
        </Box>
        <Box flexDirection="row" my={4}>
          {producer.photo && (
            <Box mr={2} width="40%">
              <Box
                as="img"
                src={producer.photo}
                alt={producer.name}
                width="100%"
                alignSelf="start"
              />
            </Box>
          )}
          <Box ml={producer.photo ? 2 : 0} flex="1">
            <Markdown flex="1">{producer.description}</Markdown>
          </Box>
        </Box>
        <Cards>
          {products.map((product) => (
            <ProductCard
              key={product.idInDistribution}
              {...product}
              link={`/distribution/${distribution.id}/${producer.id}-${slug(
                producer.name
              )}/${product.idInDistribution}-${slug(product.name)}`}
            />
          ))}
        </Cards>
      </Main>
    );
  };

const ProducerInDistributionViewWithLoading = (
  props: ProducerInDistributionViewProps
) => (
  <Loading>
    <ProducerInDistributionView {...props} />
  </Loading>
);

export default ProducerInDistributionViewWithLoading;
