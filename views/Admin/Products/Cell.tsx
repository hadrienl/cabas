import { useTranslation } from 'lib/i18n';
import { Button } from 'primereact/button';
import { OverlayPanel } from 'primereact/overlaypanel';
import { useCallback, useRef } from 'react';
import PriceSelector from './PriceSelector';
import ProducerSelector from './ProducerSelector';
import ProductSelector from './ProductSelector';

export const ADD = 'add';

type CellType = 'producer' | 'product' | 'price';

const getOverlayContent = (
  type: CellType
): ((props: { id?: number }) => JSX.Element) => {
  switch (type) {
    case 'producer':
      return ProducerSelector;
    case 'product':
      return ProductSelector;
    default:
      return PriceSelector;
  }
};
interface CellProps {
  value: string;
  type: CellType;
  id?: number;
}

export const Cell = ({ value, type, id }: CellProps) => {
  const { t } = useTranslation();
  const op = useRef<OverlayPanel>(null);

  const displaySelector = useCallback((e) => {
    if (!op.current) return;
    op.current.toggle(e);
  }, []);

  const OverlayContent = getOverlayContent(type);

  if (value === ADD) {
    return (
      <>
        <Button className="p-button-primary" onClick={displaySelector}>
          {t('admin.products.add', { context: type })}
        </Button>
        <OverlayPanel ref={op}>
          <div>
            <OverlayContent id={id} />
          </div>
        </OverlayPanel>
      </>
    );
  }
  return <div>{value}</div>;
};

export default Cell;
