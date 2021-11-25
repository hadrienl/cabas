import { FC, useCallback } from 'react';

import Box from 'components/Box';
import Main from 'components/Main';
import Text from 'components/Text';
import { getDistributionTimeRange } from 'lib/dates';
import { useTranslation } from 'lib/i18n';
import { Button } from 'primereact/button';
import { Distribution } from 'types/Entities';
import { useRouter } from 'next/router';

export interface DistributionViewProps {
  distribution: Distribution;
}
export const DistributionView: FC<DistributionViewProps> = ({
  distribution = {} as Distribution,
}) => {
  const { t } = useTranslation();
  const { isFallback } = useRouter();
  const state = getDistributionTimeRange(
    distribution.startAt,
    distribution.closeAt
  );

  const notify = useCallback(() => {
    console.log('TODO', distribution.id);
  }, [distribution.id]);

  return (
    <Main>
      <Text as="h1">{t(`distributions.${state}`)}</Text>
      {state === 'future' && (
        <>
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
            <Button type="button" onClick={notify}>
              <Text>{t('distributions.notify')}</Text>
            </Button>
          </Box>
        </>
      )}
    </Main>
  );
};

export default DistributionView;
