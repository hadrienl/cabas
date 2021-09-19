import Title from 'components/forms/Title';
import { useHeader } from 'components/Header/HeaderProvider';
import Main from 'components/Main';
import { useTranslation } from 'lib/i18n';
import { useEffect } from 'react';

export const Basket = () => {
  const { t } = useTranslation();
  const { setBreadcrumbs } = useHeader();
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
  }, []);

  return (
    <Main>
      <Title>Basket</Title>
    </Main>
  );
};
export default Basket;
