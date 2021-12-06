import { useTranslation } from 'lib/i18n';
import { Button, ButtonProps } from 'primereact/button';
import React, { useCallback } from 'react';

interface TrashButtonProps extends ButtonProps {
  tooltip?: string;
}
export const TrashButton: React.FC<TrashButtonProps> = ({
  onClick,
  tooltip = 'generic.trash.label',
}) => {
  const { t } = useTranslation();
  const [confirm, setConfirm] = React.useState(false);
  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      if (confirm) {
        onClick && onClick(e);
        return;
      }
      setConfirm(true);
    },
    [confirm, onClick]
  );

  return (
    <Button
      icon="pi pi-trash"
      className={`p-button-${confirm ? 'danger' : 'warning'}`}
      onClick={handleClick}
      tooltip={t(tooltip, { context: confirm ? 'confirm' : '' })}
      tooltipOptions={{
        position: 'left',
        className: confirm ? 'danger-tooltip' : 'warning-tooltip',
      }}
    />
  );
};

export default TrashButton;
