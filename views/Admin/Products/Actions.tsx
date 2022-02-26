import TrashButton from 'components/TrashButton';
import { Button } from 'primereact/button';
import { useCallback } from 'react';

interface ActionsProps {
  id: number;
}

export const Actions = ({ id }: ActionsProps) => {
  const remove = useCallback(() => {
    console.log('delete', id);
  }, [id]);
  if (id < 0) return null;
  return <TrashButton onClick={remove} />;
};
export default Actions;
