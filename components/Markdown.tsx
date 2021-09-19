import { FC, useMemo } from 'react';
import { markdown } from 'markdown';

import Box, { BoxProps } from './Box';

interface MarkdownProps {
  children: string;
}

export const Markdown: FC<MarkdownProps & BoxProps> = ({
  children = '',
  ...props
}) => {
  const content = useMemo(() => markdown.toHTML(children || ''), [children]);
  return (
    <Box
      css={`
        p {
          margin: 10px 0;
        }

        ul {
          margin-left: 20px;
        }
      `}
      dangerouslySetInnerHTML={{ __html: content }}
      {...(props as any)}
    />
  );
};

export default Markdown;
