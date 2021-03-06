import * as React from 'react';

import Box from 'components/Box';
import supabase from 'lib/supabase';
import { Product } from 'types/Entities';

export const Marketplace: React.FC = () => {
  const [products, setProducts] = React.useState<Product[]>();
  const [error, setError] = React.useState<string>();
  const getProducts = React.useCallback(async () => {
    const { data, error } = await supabase
      .from('products')
      .select('*, provider:provider_id(*)')
      .eq('status', 'PUBLISHED');
    if (data) {
      setProducts(data);
    }
    if (error) {
      setError(error.message);
    }
  }, []);
  React.useEffect(() => {
    getProducts();
  }, []);

  return (
    <Box>
      <Box>Market place</Box>
      {error && <Box>{error}</Box>}
      <table>
        <thead>
          <tr>
            <th>Nom</th>
            <th>Pwet</th>
          </tr>
        </thead>
        <tbody>
          {products &&
            products.map(({ id, name, provider = {} }) => (
              <tr key={id}>
                <td>{name}</td>
                <td>{provider.name}</td>
              </tr>
            ))}
        </tbody>
      </table>
    </Box>
  );
};
export default Marketplace;
