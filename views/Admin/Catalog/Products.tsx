import Box from 'components/Box';
import TrashButton from 'components/TrashButton';
import api from 'lib/api';
import supabase from 'lib/supabase';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Sidebar } from 'primereact/sidebar';
import { useCallback, useEffect, useState } from 'react';
import { Product, ProductBase } from 'types/Entities';
import EditProduct from './EditProduct';

interface ProductsProps {
  id: number;
}

export const Products = ({ id }: ProductsProps) => {
  const [products, setProducts] = useState<ProductBase[]>([]);
  const [editProduct, setEditProduct] = useState<Partial<Product>>();

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase
        .from('product')
        .select('*')
        .eq('fk_producer', id);

      if (!data) return;
      setProducts(data);
    };
    fetch();
  }, [id]);

  const saveProduct = useCallback(async (product: Product) => {
    setEditProduct(undefined);
    const saved = await api.saveProduct({ ...product, fk_producer: id });
    if (!saved) return;
    setProducts((products) => {
      const newProducts = [...products];
      const found = newProducts.findIndex(({ id }) => saved.id === id);
      if (found > -1) {
        newProducts[found] = saved;
      } else {
        newProducts.push(product);
      }
      return newProducts;
    });
  }, []);

  return (
    <>
      <DataTable value={products} editMode="cell">
        <Column field="name" />
        <Column field="description" />
        <Column
          field="photo"
          body={({ photo }) => photo && <img src={photo} alt="" width={50} />}
        />
        <Column
          body={(product) => (
            <Box flexDirection="row" justifyContent="space-around">
              <Button onClick={() => setEditProduct(product)}>Editer</Button>
            </Box>
          )}
        />
      </DataTable>
      <Button onClick={() => setEditProduct({})}>Ajouter</Button>
      <Sidebar
        visible={!!editProduct}
        onHide={() => setEditProduct(undefined)}
        position="right"
      >
        <EditProduct product={editProduct} onSubmit={saveProduct} />
      </Sidebar>
    </>
  );
};

export default Products;
