import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { cloneElement, FC, ReactElement } from 'react';
import Box from './Box';

interface LinkProps {
  href: string;
  as?: FC | string;
  activeClassName?: string;
  children: ReactElement | string;
}

export const Link: FC<LinkProps> = ({
  href,
  as: As = 'a',
  activeClassName = 'active',
  children,
}) => {
  const router = useRouter();

  const isActive = router.pathname === href;

  const lastChildren =
    typeof children === 'string' ? (
      <Box as={As as any} href={href}>
        {children}
      </Box>
    ) : (
      (children as ReactElement)
    );

  return (
    <NextLink href={href}>
      {cloneElement(lastChildren, {
        className: `${lastChildren.props.className || ''} ${
          isActive ? activeClassName : ''
        }`,
      })}
    </NextLink>
  );
};

export default Link;
