import Box from 'components/Box';
import { useTranslation } from 'lib/i18n';
import { Button } from 'primereact/button';
import { OverlayPanel } from 'primereact/overlaypanel';
import { useCallback, useRef } from 'react';
import PriceSelector from './PriceSelector';
import ProducerSelector from './ProducerSelector';
import ProductSelector from './ProductSelector';
import { OverlayContent } from './types';

export const ADD = 'add';

type CellType = 'producer' | 'product' | 'price';

const getOverlayContent = (
  type: CellType
): ((props: OverlayContent) => JSX.Element | null) => {
  switch (type) {
    case 'producer':
      return ProducerSelector;
    case 'product':
      return ProductSelector;
    default:
      return PriceSelector;
  }
};
interface CellProps extends OverlayContent {
  value: string;
  type: CellType;
}

export const Cell = ({ value, type, id, onChange }: CellProps) => {
  const { t } = useTranslation();
  const op = useRef<OverlayPanel>(null);

  const displaySelector = useCallback((e) => {
    if (!op.current) return;
    op.current.toggle(e);
  }, []);

  const OverlayContent = getOverlayContent(type);
  const setValue = useCallback(
    (id: number) => {
      onChange(id);
      op.current?.hide();
    },
    [onChange]
  );
  if (value === ADD) {
    return (
      <>
        <Button className="p-button-primary" onClick={displaySelector}>
          {t('admin.products.add', { context: type })}
        </Button>
        <OverlayPanel ref={op}>
          <Box p={0} m="-1rem" height="400px" style={{ overflow: 'auto' }}>
            <OverlayContent id={id} onChange={setValue} />
          </Box>
        </OverlayPanel>
      </>
    );
  }
  return <div>{value}</div>;
};

export default Cell;
