import TrashButton from 'components/TrashButton';
import supabase from 'lib/supabase';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { useCallback, useEffect, useState } from 'react';
import { ProductBase } from 'types/Entities';

interface ProductsProps {
  id: number;
}

export const Products = ({ id }: ProductsProps) => {
  const [products, setProducts] = useState<ProductBase[]>([]);

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

  const addProduct = useCallback(() => {
    setProducts([
      ...products,
      {
        id: -1,
        name: '',
        description: '',
        photo: '',
      },
    ]);
  }, [products]);
  const updateProduct = useCallback(
    async ({ newRowData }: any) => {
      const newProducts = products.map((product) =>
        product.id === newRowData.id ? newRowData : product
      );
      setProducts(newProducts);

      if (newRowData.id > -1) {
        await supabase
          .from('product')
          .update(newRowData)
          .eq('id', newRowData.id);
      } else {
        const { id: nullId, ...toInsert } = newRowData;
        const { data } = await supabase.from('product').insert({
          ...toInsert,
          fk_producer: id,
        });
        if (!data) return;
        setProducts((products) => [
          ...products.filter(({ id }) => id !== nullId),
          ...data,
        ]);
      }
    },
    [id, products]
  );

  return (
    <>
      <Button onClick={addProduct}>Ajouter</Button>
      <DataTable value={products} editMode="cell">
        <Column
          field="name"
          onCellEditComplete={updateProduct}
          editor={({ value, editorCallback = () => null }) => (
            <textarea
              onChange={({ target: { value } }) => editorCallback(value)}
              value={value}
            />
          )}
        />
        <Column
          field="description"
          onCellEditComplete={updateProduct}
          editor={({ value, editorCallback = () => null }) => (
            <textarea
              onChange={({ target: { value } }) => editorCallback(value)}
              value={value}
            />
          )}
        />
        <Column
          field="photo"
          body={({ photo }) => photo && <img src={photo} alt="" width={50} />}
        />
      </DataTable>
      <Button onClick={addProduct}>Ajouter</Button>
    </>
  );
};

export default Products;
