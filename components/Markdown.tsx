import { FC, useMemo } from 'react';
import { markdown } from 'markdown';

import Box, { BoxProps } from './Box';

interface MarkdownProps {
  children: string;
  cut?: number;
}

const cutContent = (content: string, len: number) => {
  const truncated = content.substr(0, len);

  return truncated === content ? truncated : `${truncated}…`;
};

export const Markdown: FC<MarkdownProps & BoxProps> = ({
  children = '',
  cut,
  ...props
}) => {
  const content = useMemo(
    () => markdown.toHTML(cut ? cutContent(children, cut) : children || ''),
    [children, cut]
  );
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
