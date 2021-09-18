import { FC, useMemo } from 'react';

import Main from 'components/Main';
import Text from 'components/Text';
import { Distribution } from 'resources/types';
import { useTranslation } from 'lib/i18n';
import Box from 'components/Box';
import DistributionsList from './DistributionsList';

export interface HomeViewProps {
  distributions: Distribution[];
}
export const HomeView: FC<HomeViewProps> = ({ distributions }) => {
  const { t } = useTranslation();

  const current = useMemo(() => {
    const now = new Date();
    return distributions.filter(
      ({ startAt, closeAt }) =>
        now > new Date(startAt) && now < new Date(closeAt)
    );
  }, [distributions]);
  const next = useMemo(() => {
    const now = new Date();
    return distributions.filter(({ startAt }) => now < new Date(startAt));
  }, [distributions]);
  const past = useMemo(() => {
    const now = new Date();
    return distributions.filter(({ closeAt }) => now > new Date(closeAt));
  }, [distributions]);

  return (
    <Main>
      <Text as="h1" marginY={2}>
        {t('home.welcome')}
      </Text>
      <Box>
        {current.length > 0 && (
          <Box>
            <Text as="h2" marginY={2}>
              {t('distributions.current')}
            </Text>
            <DistributionsList distributions={current} />
          </Box>
        )}
        {next.length > 0 && (
          <Box>
            <Text as="h2" marginY={2}>
              {t('distributions.next', { count: next.length })}
            </Text>
            <DistributionsList distributions={next} />
          </Box>
        )}
        {past.length > 0 && (
          <Box>
            <Text as="h2" marginY={2}>
              {t('distributions.past', { count: past.length })}
            </Text>
            <DistributionsList distributions={past} />
          </Box>
        )}
      </Box>
    </Main>
  );
};

export default HomeView;
