import Box from 'components/Box';
import supabase from 'lib/supabase';
import useNumberFormat from 'lib/useNumberFormat';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Product } from 'types/Entities';
import { getLayout } from '../Layout';
import { useDistribution } from '../useDistribution';
import Actions from './Actions';
import Bulk from './Bulk';
import CatalogProvider from './CatalogProvider';
import Cell, { ADD } from './Cell';

export const Products = () => {
  const distribution = useDistribution();
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState([]);
  const [products, setProducts] = useState<Product[]>([]);

  const numberFormat = useNumberFormat();

  useEffect(() => {
    if (!distribution) return;
    const fetchProducts = async () => {
      setLoading(true);
      const { data } = await supabase
        .from('distributed_products')
        .select('*')
        .eq('distribution_id', distribution.id);
      if (data) {
        setProducts(
          data.map(
            ({
              id,
              id_in_distribution,
              name,
              description,
              photo,
              perUnit,
              price,
              unit,
              unitLabel,
              producer_id,
              producer_name,
              producer_description,
            }: any) => ({
              id,
              pid: id_in_distribution,
              name,
              photo,
              description,
              perUnit,
              price,
              unit,
              unitLabel,
              producer: {
                id: producer_id,
                name: producer_name,
                description: producer_description,
              },
            })
          )
        );
      }
      setLoading(false);
    };
    fetchProducts();
  }, [distribution]);

  const data = useMemo(() => {
    const data = products.map(
      ({ id, name, producer = {}, price, unit, unitLabel, perUnit, pid }) => ({
        producerId: producer.id,
        producerName: producer.name || '',
        productId: id,
        productName: name,
        price: numberFormat(price, {
          style: 'currency',
          currency: 'EUR',
          currencyDisplay: 'symbol',
        }),
        unit: `${unit || ''}`,
        unitLabel,
        perUnit: `${perUnit || ''}`,
        pid,
      })
    );
    data.sort((a, b) => {
      if (a.producerName > b.producerName) return 1;
      if (a.producerName < b.producerName) return -1;
      return 0;
    });

    return [
      ...data.flatMap(({ producerId, productId, price, ...rest }, index) => {
        const next = [{ producerId, productId, price, ...rest }];
        if (data[index + 1] && data[index + 1].producerId !== producerId) {
          next.push({
            ...next[0],
            producerId: -1,
            producerName: ADD,
            productId: -1,
            productName: '',
            price: '',
            unit: '',
            unitLabel: '',
            perUnit: '',
            pid: -1,
          });
        }
        if (!data[index + 1] || data[index + 1].productId !== productId) {
          next.push({
            ...next[0],
            price: ADD,
            unit: '',
            unitLabel: '',
            perUnit: '',
            pid: -1,
          });
          next.push({
            producerId: data[index - 1].producerId,
            producerName: data[index - 1].producerName,
            productId: -1,
            productName: ADD,
            price: '',
            unit: '',
            unitLabel: '',
            perUnit: '',
            pid: -1,
          });
        }
        return next;
      }),
      {
        producerId: -1,
        producerName: ADD,
      },
    ];
  }, [numberFormat, products]);

  const setProducer = useCallback((id: number) => {}, []);
  const setProduct = useCallback(async (id: number) => {
    console.log('set product', id);
  }, []);

  const setPrice = useCallback(
    async ({
      id,
      ...data
    }: {
      id: number;
      price: number;
      unit: number;
      unitLabel: string;
      perUnit: string;
    }) => {
      if (!id || !distribution) return;
      const { data: d } = await supabase
        .from('product_in_distribution')
        .insert({
          fk_distribution: distribution.id,
          fk_product: id,
          ...data,
        });
      console.log(d);
    },
    [distribution]
  );

  return (
    <CatalogProvider>
      <Box>
        <DataTable
          value={data}
          //selection={selected}
          //onSelectionChange={(e) => setSelected(e.value)}
        >
          {/*<Column
            header={() =>
              selected.length > 0 && (
                <Box
                  position="absolute"
                  top="0"
                  left="5px"
                  bottom="0"
                  right="0"
                  justifyContent="center"
                >
                  <Bulk />
                </Box>
              )
            }
            headerStyle={{ position: 'relative' }}
          />*/}
          {/*<Column selectionMode="multiple" />*/}
          <Column
            field="producer"
            header="Producteur"
            body={({ producerName }) => (
              <Cell
                value={producerName}
                type="producer"
                onChange={setProducer}
              />
            )}
          />
          <Column
            field="product"
            header="Product"
            body={({ producerId, productName }) => (
              <Cell
                value={productName}
                id={producerId}
                type="product"
                onChange={setProduct}
              />
            )}
          />
          <Column
            field="price"
            header="Prix"
            body={({ price, productId }) => (
              <Cell
                value={price}
                id={productId}
                type="price"
                onChange={setPrice}
              />
            )}
          />
          <Column field="unit" header="Unit" />
          <Column field="unitLabel" header="Libellé" />
          <Column field="perUnit" header="Par unité" />
          <Column body={({ pid }) => <Actions id={pid} />} />
        </DataTable>
      </Box>
    </CatalogProvider>
  );
};

Products.getLayout = getLayout;

export default Products;
