import { FC } from 'react';

import Box, { BoxProps } from 'components/Box';

export const Cards: FC<BoxProps> = ({ children }) => {
  return (
    <Box flexDirection="row" flexWrap="wrap" margin="10px -10px">
      {children}
    </Box>
  );
};

export default Cards;
