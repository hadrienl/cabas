import { Children, FC, ReactNode } from 'react';
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
        <Box>{header}</Box>
        <Box as="main" flex="1">
          {children}
        </Box>
        <Box>{footer}</Box>
      </Box>
    </>
  );
};
