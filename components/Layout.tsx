import { FC, ReactNode } from 'react';
import Box from './Box';

interface LayoutProps {
  header: ReactNode;
  footer: ReactNode;
}

export const Layout: FC<LayoutProps> = ({ header, footer, children }) => {
  return (
    <>
      <Box
        justifyContent="center"
        alignItems="stretch"
        flex="1"
        minHeight="100vh"
      >
        {header}
        <Box as="main" flex="1" alignItems="stretch" padding="3">
          {children}
        </Box>
        <Box alignItems="stretch">{footer}</Box>
      </Box>
    </>
  );
};
