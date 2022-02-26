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
  const { push, asPath } = useRouter();

  const isActive = asPath === href;

  const navigate = useCallback(
    (e: MouseEvent<HTMLAnchorElement>) => {
      e.preventDefault();
      push(href);
    },
    [href, push]
  );

  return (
    <Box
      as="a"
      href={href}
      onClick={navigate}
      className={isActive ? activeClassName : ''}
      {...(props as any)}
    >
      {children}
    </Box>
  );
};

export default Link;
