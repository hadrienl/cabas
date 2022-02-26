import { useDistributions } from 'components/DistributionsProvider/context';
import { useRouter } from 'next/router';

export const useDistribution = () => {
  const {
    query: { id },
  } = useRouter();
  const { distributions } = useDistributions();
  const distribution = id && distributions.find(({ id: did }) => did === +id);

  return distribution;
};
