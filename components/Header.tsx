import Link from 'next/link';
import Box from './Box';

export const Header = () => {
  return (
    <Box as="h1">
      <Link href="/">Cabas</Link>
    </Box>
  );
};

export default Header;
