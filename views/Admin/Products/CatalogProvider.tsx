import supabase from 'lib/supabase';
import { createContext, FC, useCallback, useContext, useState } from 'react';
import { Producer, Product } from 'types/Entities';

interface CatalogContext {
  producers: Map<number, Producer>;
  products: Map<number, Set<Product>>;
  fetchProducers: () => void;
  fetchProducts: (producerId: number) => void;
}
export const context = createContext<CatalogContext>({
  producers: new Map(),
  products: new Map(),
  fetchProducers() {},
  fetchProducts() {},
});

export const useCatalog = () => useContext(context);

export const CatalogProvider: FC = ({ children }) => {
  const [producers, setProducers] = useState<CatalogContext['producers']>(
    new Map()
  );
  const [products, setProducts] = useState<CatalogContext['products']>(
    new Map()
  );

  const fetchProducers: CatalogContext['fetchProducers'] = useCallback(async () => {
    const { data } = await supabase.from<Producer>('producer').select('*');
    if (!data) return;
    setProducers(new Map(data.map((item) => [item.id, item])));
  }, []);

  const fetchProducts: CatalogContext['fetchProducts'] = useCallback(
    async (id) => {
      console.log('id', id);
      const { data } = await supabase
        .from<Product & { fk_producer: number }>('product')
        .select('*')
        .eq('fk_producer', id);
      if (!data) return;
      setProducts((products) => {
        const newProducts = new Map(products);
        newProducts.set(id, new Set(data));
        return newProducts;
      });
    },
    []
  );

  return (
    <context.Provider
      value={{ producers, products, fetchProducers, fetchProducts }}
    >
      {children}
    </context.Provider>
  );
};

export default CatalogProvider;
