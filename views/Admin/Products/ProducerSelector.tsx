import { useEffect } from 'react';
import { useCatalog } from './CatalogProvider';

export const ProducerSelector = () => {
  const { fetchProducers, producers } = useCatalog();

  useEffect(() => {
    fetchProducers();
  }, [fetchProducers]);
  console.log(producers);
  return <div> Selection producer</div>;
};

export default ProducerSelector;
