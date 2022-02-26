import { Menu } from 'primereact/menu';
import { Button } from 'primereact/button';
import { useRef } from 'react';

export const Bulk = () => {
  const menu = useRef<Menu>(null);
  const items = [
    {
      label: 'Supprimer',
      icon: 'pi pi-trash',
      command: () => {
        console.log('trashe');
      },
    },
  ];
  return (
    <>
      <Menu model={items} popup ref={menu} id="popup_menu" />
      <Button
        icon="pi pi-bars"
        onClick={(event) => menu.current && menu.current.toggle(event)}
        aria-controls="popup_menu"
        aria-haspopup
      />
    </>
  );
};

export default Bulk;
