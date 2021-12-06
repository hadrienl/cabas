import { createContext, FC, useContext, useState } from 'react';

export interface Link {
  label: string;
  url: string;
}

interface HeaderContext {
  breadcrumbs?: Link[] | null;
  setBreadcrumbs: (links: Link[] | null) => void;
}

export const context = createContext<HeaderContext>({
  setBreadcrumbs: () => {},
});

export const useHeader = () => useContext(context);

export const HeaderProvider: FC = ({ children }) => {
  const [breadcrumbs, setBreadcrumbs] = useState<Link[] | null>(null);

  return (
    <context.Provider
      value={{
        breadcrumbs,
        setBreadcrumbs,
      }}
    >
      {children}
    </context.Provider>
  );
};

export default HeaderProvider;
