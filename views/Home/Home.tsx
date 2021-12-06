import { FC, useCallback } from 'react';
import { Button } from 'primereact/button';

import Main from 'components/Main';
import Text from 'components/Text';
import { DistributedProductWithProducer, Distribution } from 'types/Entities';
import { useTranslation } from 'lib/i18n';
import CurrentDistribution from './CurrentDistribution';
import Box from 'components/Box';

export interface HomeViewProps {
  distribution: Distribution | null;
  futureDistributions: Distribution[];
  products: DistributedProductWithProducer[];
}
export const HomeView: FC<HomeViewProps> = ({
  distribution,
  futureDistributions,
  products,
}) => {
  const { t } = useTranslation();

  const notify = useCallback(
    (distributionId: number) => () => {
      console.log('TODO', distributionId);
    },
    []
  );

  return (
    <Main>
      <Text as="h1" marginY={2}>
        {t('home.welcome')}
      </Text>
      {distribution && (
        <CurrentDistribution {...distribution} products={products} />
      )}
      {futureDistributions.length > 0 && (
        <Box>
          <Text as="h2">
            {t('distributions.future', { count: futureDistributions.length })}
          </Text>
          {futureDistributions.map((distribution) => (
            <Box key={distribution.id}>
              <Text>
                {t('distributions.startAt', { startAt: distribution.startAt })}
              </Text>
              <Text>
                {t('distributions.closeAt', { closeAt: distribution.closeAt })}
              </Text>
              <Text>
                {t('distributions.shipAt', { shipAt: distribution.shipAt })}
              </Text>
              <Box alignSelf="flex-start">
                <Button type="button" onClick={notify(distribution.id)}>
                  <Text>{t('distributions.notify')}</Text>
                </Button>
              </Box>
            </Box>
          ))}
        </Box>
      )}
    </Main>
  );
};

export default HomeView;
