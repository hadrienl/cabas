import { FC } from 'react';
import Box from './Box';

export const Footer: FC = () => {
  return (
    <Box
      as="footer"
      padding="1"
      fontSize="0"
      backgroundColor="var(--surface-a)"
      color="var(--text-color)"
      borderTop="1px solid var(--surface-d)"
    >
      <Box as="a" href="https://github.com/hadrienl/cabas" target="_blank">
        https://github.com/hadrienl/cabas
      </Box>
    </Box>
  );
};

export default Footer;
