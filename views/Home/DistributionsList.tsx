import { FC, useMemo } from 'react';
import { useTranslation } from 'lib/i18n';
import { Distribution } from 'resources/types';
import Box from 'components/Box';
import Text from 'components/Text';
import ProductCard from 'components/Cards/Product';
import Cards from 'components/Cards/Cards';
import Products from 'pages/product';

const isBuyable = (startAt: Date, closeAt: Date) => {
  const now = new Date();
  return now > startAt && now < closeAt;
};

interface DistributionsProps {
  distributions: Distribution[];
}
const DistributionsList: FC<DistributionsProps> = ({ distributions }) => {
  const {
    t,
    i18next: { language },
  } = useTranslation();
  const distributionsWithBuyable = useMemo(
    () =>
      distributions.map(({ products, startAt, closeAt, ...distribution }) => ({
        ...distribution,
        startAt,
        closeAt,
        products: products.map(({ ...product }) => ({
          ...product,
          isBuyable: isBuyable(new Date(startAt), new Date(closeAt)),
        })),
      })),
    []
  );

  return (
    <>
      {distributionsWithBuyable.map(({ id, startAt, closeAt, products }) => (
        <Box key={id}>
          <Text marginY={2}>
            {t('distributions.startAt', {
              date: new Intl.DateTimeFormat(language, {
                dateStyle: 'full',
              }).format(new Date(startAt)),
            })}
          </Text>
          <Cards>
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </Cards>
        </Box>
      ))}
    </>
  );
};

export default DistributionsList;
