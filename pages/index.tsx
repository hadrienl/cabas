import { GetStaticProps } from 'next';
import { getDistributions } from 'resources/distributions';
import { HomeViewProps } from 'views/Home/Home';

export { default } from 'views/Home';

export const getStaticProps: GetStaticProps<HomeViewProps> = async () => {
  const { distributions } = await getDistributions();
  return {
    props: { distributions },
  };
};
