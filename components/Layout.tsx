import { FC, ReactNode } from 'react';
import Box from './Box';

export interface LayoutProps {
  header: ReactNode;
  footer: ReactNode;
  padding?: number | string;
}

export const Layout: FC<LayoutProps> = ({
  header,
  footer,
  padding = 3,
  children,
}) => {
  return (
    <>
      <Box
        justifyContent="center"
        alignItems="stretch"
        flex="1"
        minHeight="100vh"
      >
        {header}
        <Box as="main" flex="1" alignItems="stretch" padding={padding}>
          {children}
        </Box>
        <Box alignItems="stretch">{footer}</Box>
      </Box>
    </>
  );
};
