import supabase from 'lib/supabase';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { Sidebar } from 'primereact/sidebar';
import { DataTable } from 'primereact/datatable';
import { useCallback, useEffect, useState } from 'react';
import { Producer } from 'types/Entities';
import { getLayout } from '../Layout';
import Products from './Products';
import TrashButton from 'components/TrashButton';

export const Catalog = () => {
  const [producers, setProducers] = useState<Producer[]>([]);
  const [displayProducts, setDisplayProducts] = useState<number | false>(false);

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase.from('producer').select('*').limit(100);
      if (!data) return;
      setProducers(data);
    };
    fetch();
  }, []);

  const updateProducer = useCallback(
    async ({ newRowData }: any) => {
      const newProducers = producers.map((producer) =>
        producer.id === newRowData.id ? newRowData : producer
      );
      setProducers(newProducers);

      if (newRowData.id > -1) {
        await supabase
          .from('producer')
          .update(newRowData)
          .eq('id', newRowData.id);
      } else {
        const { id: nullId, ...toInsert } = newRowData;
        const { data } = await supabase.from('producer').insert(toInsert);
        if (!data) return;
        setProducers((producers) => [
          ...producers.filter(({ id }) => id !== nullId),
          ...data,
        ]);
      }
    },
    [producers]
  );

  const addProducer = useCallback(() => {
    setProducers([
      ...producers,
      {
        id: -1,
        name: '',
        description: '',
        photo: '',
      },
    ]);
  }, [producers]);

  const showProducts = useCallback(
    (id: number) => () => {
      setDisplayProducts(id);
    },
    []
  );

  return (
    <>
      <Button onClick={addProducer}>Ajouter</Button>
      <DataTable value={producers} editMode="cell">
        <Column
          field="name"
          onCellEditComplete={updateProducer}
          editor={({ value, editorCallback = () => null }) => (
            <textarea
              onChange={({ target: { value } }) => editorCallback(value)}
              value={value}
            />
          )}
        />
        <Column
          field="description"
          onCellEditComplete={updateProducer}
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
        <Column
          body={({ id }) =>
            id > -1 && <Button onClick={showProducts(id)}>Produits</Button>
          }
        />
      </DataTable>
      <Button onClick={addProducer}>Ajouter</Button>
      <Sidebar
        visible={!!displayProducts}
        onHide={() => setDisplayProducts(false)}
        position="right"
        className="p-sidebar-lg"
      >
        {typeof displayProducts === 'number' && (
          <Products id={displayProducts} />
        )}
      </Sidebar>
    </>
  );
};

Catalog.getLayout = getLayout;
export default Catalog;
