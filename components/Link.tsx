import { FC, MouseEvent, useCallback } from 'react';
import { useRouter } from 'next/router';

import Box, { BoxProps } from './Box';

interface LinkProps extends BoxProps {
  href: string;
  activeClassName?: string;
}

export const Link: FC<LinkProps> = ({
  href,
  activeClassName = 'active',
  children,
  ...props
}) => {
  const { push, pathname } = useRouter();

  const isActive = pathname === href;

  const navigate = useCallback(
    (e: MouseEvent<HTMLAnchorElement>) => {
      e.preventDefault();
      push(href);
    },
    [push]
  );

  return (
    // @ts-ignore because styled component :(
    <Box
      as="a"
      href={href}
      onClick={navigate}
      className={isActive ? activeClassName : ''}
      {...props}
    >
      {children}
    </Box>
  );
};

export default Link;
