import { Children, FC } from 'react';
import Box from './Box';
import ResetStyles from 'components/ResetStyles';

export const Layout: FC = ({ children }) => {
  const [header, ...content] = Children.toArray(children);
  const footer = content.pop();

  return (
    <>
      <ResetStyles />
      <Box
        justifyContent="center"
        alignItems="stretch"
        flex="1"
        minHeight="100vh"
      >
        <Box>{header}</Box>
        <Box as="main" flex="1">
          {content}
        </Box>
        <Box>{footer}</Box>
      </Box>
    </>
  );
};
