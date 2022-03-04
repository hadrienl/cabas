import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { useEffect, useMemo } from 'react';
import { useCatalog } from './CatalogProvider';
import { OverlayContent } from './types';

export const ProducerSelector = ({ id, onChange }: OverlayContent) => {
  const { fetchProducers, producers } = useCatalog();

  useEffect(() => {
    fetchProducers();
  }, [fetchProducers]);

  return (
    <DataTable value={Array.from(producers.values())}>
      <Column field="name" />
      <Column
        body={({ id }) => (
          <Button onClick={() => onChange({ id })}>Choisir</Button>
        )}
      />
    </DataTable>
  );
};

export default ProducerSelector;
