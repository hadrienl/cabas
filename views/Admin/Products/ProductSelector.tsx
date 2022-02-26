import { useEffect } from 'react';
import { useCatalog } from './CatalogProvider';

interface ProductSelectorProps {
  id?: number;
}
export const ProductSelector = ({ id }: ProductSelectorProps) => {
  const { fetchProducts, products } = useCatalog();

  useEffect(() => {
    if (!id) return;
    fetchProducts(id);
  }, [fetchProducts, id]);
  console.log(id && products.get(id));
  return <div> Selection producer</div>;
};

export default ProductSelector;
