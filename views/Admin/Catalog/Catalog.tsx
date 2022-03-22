import supabase from 'lib/supabase';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { Sidebar } from 'primereact/sidebar';
import { DataTable } from 'primereact/datatable';
import { useCallback, useEffect, useState } from 'react';
import { Producer } from 'types/Entities';
import { getLayout } from '../Layout';
import Products from './Products';
import EditProducer from './EditProducer';
import api from 'lib/api';
import Box from 'components/Box';

export const Catalog = () => {
  const [producers, setProducers] = useState<Producer[]>([]);
  const [displayProducts, setDisplayProducts] = useState<number | false>(false);
  const [editProducer, setEditProducer] = useState<Partial<Producer>>();

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase.from('producer').select('*').limit(100);
      if (!data) return;
      setProducers(data);
    };
    fetch();
  }, []);

  const addProducer = useCallback(() => {
    setEditProducer({});
  }, []);
  const saveProducer = useCallback(async (producer: Producer) => {
    setEditProducer(undefined);
    const saved = await api.saveProducer(producer);
    if (!saved) return;
    setProducers((producers) => {
      const newProducers = [...producers];
      const found = newProducers.findIndex(({ id }) => saved.id === id);
      if (found > -1) {
        newProducers[found] = saved;
      } else {
        newProducers.push(producer);
      }
      return newProducers;
    });
  }, []);

  const showProducts = useCallback(
    (id: number) => () => {
      setDisplayProducts(id);
    },
    []
  );

  return (
    <>
      <DataTable value={producers} editMode="cell">
        <Column field="name" />
        <Column field="description" />
        <Column
          field="photo"
          body={({ photo }) => photo && <img src={photo} alt="" width={50} />}
        />
        <Column
          body={(producer) => (
            <Box flexDirection="row" justifyContent="space-around">
              {producer.id > -1 && (
                <Button onClick={showProducts(producer.id)}>Produits</Button>
              )}
              <Button onClick={() => setEditProducer(producer)}>Editer</Button>
            </Box>
          )}
        />
      </DataTable>
      <Button onClick={addProducer}>Ajouter</Button>
      <Sidebar
        visible={!!editProducer}
        onHide={() => setEditProducer(undefined)}
        position="right"
      >
        <EditProducer producer={editProducer} onSubmit={saveProducer} />
      </Sidebar>
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
