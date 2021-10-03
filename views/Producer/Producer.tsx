import { FC, useEffect, useMemo } from 'react';

import Box from 'components/Box';
import Text from 'components/Text';
import Main from 'components/Main';
import {
  Distribution,
  Producer,
  Product,
  ProductInDistribution,
  ProductWithDistributions,
} from 'types/Entities';
import Cards from 'components/Cards/Cards';
import ProductCard from 'components/Cards/Product';
import { Link, useHeader } from 'components/Header/HeaderProvider';
import { useTranslation } from 'lib/i18n';
import Markdown from 'components/Markdown';
import Loading from 'views/Common/Loading';
import { getDistributionTimeRange } from 'lib/dates';
import slug from 'slug';

export interface ProducerViewProps {
  producer: Producer;
  products: (Product & {
    distribution: ProductInDistribution & Distribution;
  })[];
}

export const ProducerView: FC<ProducerViewProps> = ({
  producer: { id, name, description, photo },
  products,
}) => {
  const { t } = useTranslation();
  const { setBreadcrumbs } = useHeader();
  useEffect(() => {
    setBreadcrumbs(
      [
        { url: '/producer', label: t('producer.title') },
        {
          url: `/producer/${id}-${name}`,
          label: name,
        },
      ].filter(Boolean) as Link[]
    );

    return () => setBreadcrumbs(null);
  }, [id, name, setBreadcrumbs, t]);

  const { inCurrentDistribution, notInCurrentDistribution } = useMemo(() => {
    const inCurrentDistribution = products.filter(
      ({ distribution: { startAt, closeAt } }) =>
        getDistributionTimeRange(startAt, closeAt) === 'current'
    );
    const notInCurrentDistribution = products.filter(
      ({ id, distribution: { startAt, closeAt } }) =>
        !inCurrentDistribution.find(({ id: currentId }) => currentId === id) &&
        getDistributionTimeRange(startAt, closeAt) !== 'current'
    );
    return { inCurrentDistribution, notInCurrentDistribution };
  }, [products]);

  return (
    <Main>
      <Box>
        <Text as="h1">{name}</Text>
        <Box flexDirection="row" my={4}>
          {photo && (
            <Box mr={2} width="40%">
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
          </Box>
        </Box>
        <Text as="h2">{t('producer.products')}</Text>
        {inCurrentDistribution && (
          <Cards>
            {inCurrentDistribution.map(({ distribution, ...product }) => {
              return (
                <ProductCard
                  key={product.id}
                  {...product}
                  distributed={distribution}
                  link={`/distribution/${distribution.id}/${product.id}-${slug(
                    product.name
                  )}`}
                />
              );
            })}
          </Cards>
        )}
        {notInCurrentDistribution && (
          <Cards>
            {notInCurrentDistribution.map(({ distribution, ...product }) => {
              return (
                <ProductCard
                  key={product.id}
                  {...product}
                  link={`/product/${product.id}-${slug(product.name)}`}
                />
              );
            })}
          </Cards>
        )}
      </Box>
    </Main>
  );
};

const ProducerViewWithLoading = (props: ProducerViewProps) => (
  <Loading>
    <ProducerView {...props} />
  </Loading>
);

export default ProducerViewWithLoading;
