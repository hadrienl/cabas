import { useBasket } from 'components/BasketProvider';
import Box from 'components/Box';
import Title from 'components/forms/Title';
import { useHeader } from 'components/Header/HeaderProvider';
import Link from 'components/Link';
import Main from 'components/Main';
import Text from 'components/Text';
import { useUser } from 'components/UserProvider';
import { useTranslation } from 'lib/i18n';
import { useRouter } from 'next/router';
import { Button } from 'primereact/button';
import { useCallback, useEffect, useState } from 'react';
import ProductsInBasket from './ProductsInBasket';

export const Basket = () => {
  const { t } = useTranslation();
  const { customer } = useUser();
  const { push } = useRouter();
  const { setBreadcrumbs } = useHeader();
  const { basket, submit } = useBasket();
  const [needAccount, setNeedAccount] = useState(false);

  const onSubmit = useCallback(async () => {
    if (!customer) {
      if (needAccount) {
        push('/signin');
      }
      setNeedAccount(true);
      const timeout = setTimeout(() => push('/signin'), 5000);
      return () => {
        clearTimeout(timeout);
      };
    }
    const orderId = await submit();
    push('/account/orders');
  }, [customer, needAccount, push, submit]);

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
        <>
          <ProductsInBasket products={basket ? basket.products : undefined} />
          <Box alignItems="flex-end">
            <Button
              onClick={onSubmit}
              className={needAccount ? 'p-button-danger' : ''}
            >
              {t('basket.submit', { context: needAccount && 'signup' })}
            </Button>
          </Box>
        </>
      )}
      {hasProduct === 0 && (
        <Box>
          <Text>{t('basket.empty')}</Text>
        </Box>
      )}
      {hasProduct < 0 && <div>Wait for it</div>}
    </Main>
  );
};
export default Basket;
