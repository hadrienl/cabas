import { useBasket } from 'components/BasketProvider';
import Box from 'components/Box';
import Title from 'components/forms/Title';
import { useHeader } from 'components/Header/HeaderProvider';
import Main from 'components/Main';
import Text from 'components/Text';
import { useTranslation } from 'lib/i18n';
import { useEffect } from 'react';
import Loading from 'views/Common/Loading';
import ProductsInBasket from './ProductsInBasket';

export const Basket = () => {
  const { t } = useTranslation();
  const { setBreadcrumbs } = useHeader();
  const { basket } = useBasket();

  useEffect(() => {
    setBreadcrumbs([
      {
        label: t('basket.title'),
        url: '/basket',
      },
    ]);

    return () => {
      setBreadcrumbs([]);
    };
  }, [setBreadcrumbs, t]);

  const hasProduct = basket && basket.products ? basket.products.length : -1;

  return (
    <Main>
      <Title>Basket</Title>
      {hasProduct > 0 && (
        <ProductsInBasket products={basket ? basket.products : undefined} />
      )}
      {hasProduct === 0 && (
        <Box>
          <Text>Votre panier est vide :(</Text>
        </Box>
      )}
      {hasProduct < 0 && <Loading />}
    </Main>
  );
};
export default Basket;
