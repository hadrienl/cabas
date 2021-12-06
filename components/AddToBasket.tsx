import { FC, useCallback, useEffect, useState } from 'react';
import { Button } from 'primereact/button';
import { InputNumber } from 'primereact/inputnumber';

import { ProductUnit, ProductInDistribution, Product } from 'types/Entities';
import Box from './Box';
import Text from './Text';
import { useTranslation } from 'lib/i18n';
import useNumberFormat from 'lib/useNumberFormat';
import { useBasket } from './BasketProvider';
import { getSuffix } from 'lib/strings';

interface AddToBasketProps extends Pick<Product, 'id'>, ProductInDistribution {}
export const AddToBasket: FC<AddToBasketProps> = ({
  id,
  unit,
  price,
  unitLabel,
  perUnit,
}) => {
  const { t } = useTranslation();
  const { addProduct } = useBasket();
  const numberFormat = useNumberFormat();
  const [count, setCount] = useState(1);
  const [added, setAdded] = useState(false);
  const add = useCallback(() => {
    addProduct(id, count);
    setAdded(true);
    setCount(1);
  }, [addProduct, count, id]);
  useEffect(() => {
    const timeout = setTimeout(() => setAdded(false), 2000);
    return () => {
      clearTimeout(timeout);
    };
  }, [added]);
  const total = count * price;
  const suffix = getSuffix(unit);

  return (
    <Box flex="1" justifyContent="end">
      <Box flexDirection="row" justifyContent="space-between" mb={2}>
        <Box>
          <Box flexDirection="row" alignItems="baseline">
            <Text fontSize={4}>
              {t('product.price', {
                price: numberFormat(price, {
                  style: 'currency',
                  currency: 'EUR',
                }),
                context: `${unit}`,
              })}
            </Text>
            {unitLabel && <Text> / {unitLabel}</Text>}
          </Box>
          <Text ml={2}>
            {t('product.addToBasket.totalPrice', {
              price: numberFormat(total, {
                currency: 'EUR',
                style: 'currency',
              }),
            })}
          </Text>
        </Box>
        <InputNumber
          value={count}
          onValueChange={({ value }) => setCount(+value)}
          mode="decimal"
          showButtons
          buttonLayout="horizontal"
          size={5}
          min={0}
          suffix={suffix}
          maxFractionDigits={2}
          inputMode="decimal"
          step={unit === ProductUnit.Piece ? 1 : 0.1}
        />
      </Box>
      <Button type="button" onClick={add}>
        <Text justifyContent="center" flex="1">
          {!added && t('product.addToBasket.label')}
          {added && (
            <>
              {t('product.addToBasket.label', { context: 'added' })}
              <Box className="pi pi-thumbs-up" ml={2} />
            </>
          )}
        </Text>
      </Button>
    </Box>
  );
};

export default AddToBasket;
