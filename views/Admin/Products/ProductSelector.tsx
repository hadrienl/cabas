import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { useEffect } from 'react';
import { useCatalog } from './CatalogProvider';
import { OverlayContent } from './types';

export const ProductSelector = ({ id, onChange }: OverlayContent) => {
  const { fetchProducts, products } = useCatalog();

  useEffect(() => {
    if (!id) return;
    fetchProducts(id);
  }, [fetchProducts, id]);

  if (!id) return null;

  return (
    <DataTable value={Array.from((products.get(id) || new Set()).values())}>
      <Column field="name" />
      <Column
        body={({ id }) => (
          <Button onClick={() => onChange({ id })}>Choisir</Button>
        )}
      />
    </DataTable>
  );
};

export default ProductSelector;
