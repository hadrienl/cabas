import Box from 'components/Box';
import Cards from 'components/Cards/Cards';
import ProductCard from 'components/Cards/Product';
import Link from 'components/Link';
import Text from 'components/Text';
import { useTranslation } from 'lib/i18n';
import { FC, useMemo } from 'react';
import slug from 'slug';
import {
  DistributedProduct,
  DistributedProductWithProducer,
  Distribution,
  Producer,
} from 'types/Entities';

interface CurrentDistributionProps extends Distribution {
  products: DistributedProductWithProducer[];
}
export const CurrentDistribution: FC<CurrentDistributionProps> = ({
  id,
  startAt,
  closeAt,
  shipAt,
  products,
}) => {
  const { t } = useTranslation();

  const byProducer = useMemo(
    () =>
      products.reduce<(Producer & { products: DistributedProduct[] })[]>(
        (
          prev,
          {
            producerId,
            producerName,
            producerDescription,
            producerPhoto,
            ...product
          }
        ) => {
          const producer = prev.find(({ id }) => producerId === id);
          if (!producer) {
            prev.push({
              id: producerId,
              name: producerName,
              description: producerDescription,
              photo: producerPhoto,
              products: [product],
            });
          } else {
            producer.products = [...producer.products, product];
          }
          return [...prev];
        },
        []
      ),
    [products]
  );

  return (
    <Box>
      <Box>
        <Text as="h2">{t('distributions.current')}</Text>
        <Text>{t('distributions.open', { closeAt })}</Text>
        <Text>{t('distributions.ship', { shipAt })}</Text>
      </Box>
      {byProducer.map((producer) => (
        <Box key={producer.id} mt={3}>
          <Text as="h3">
            <Link
              href={`/distribution/${id}/${producer.id}-${slug(producer.name)}`}
            >
              {producer.name}
            </Link>
          </Text>
          <Cards>
            {producer.products.map((product) => (
              <ProductCard
                key={product.idInDistribution}
                {...product}
                link={`/distribution/${id}/${producer.id}-${slug(
                  producer.name
                )}/${product.idInDistribution}-${slug(product.name)}`}
              />
            ))}
          </Cards>
        </Box>
      ))}
    </Box>
  );
};

export default CurrentDistribution;
