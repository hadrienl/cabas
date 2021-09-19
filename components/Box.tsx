import styled from 'styled-components';
import {
  border,
  BorderProps,
  color,
  ColorProps,
  flexbox,
  FlexboxProps,
  layout,
  LayoutProps,
  position,
  space,
  SpaceProps,
  style,
  typography,
  TypographyProps,
} from 'styled-system';

const cursor = style({ prop: 'cursor' });
const visibility = style({ prop: 'visibility' });
const boxShadow = style({ prop: 'boxShadow' });
const wordBreak = style({ prop: 'wordBreak' });

export type BoxProps = BorderProps &
  FlexboxProps &
  LayoutProps &
  SpaceProps &
  TypographyProps &
  ColorProps & {
    cursor?: string;
    visibility?: string;
    boxShadow?: string;
    wordBreak?: string;
    position?: 'absolute' | 'relative' | 'static';
    top?: string;
    left?: string;
    right?: string;
    bottom?: string;
    overflow?: 'hidden' | 'visible' | 'auto' | 'scroll';
    css?: string;
  };

const styles = [
  space,
  layout,
  cursor,
  color,
  typography,
  flexbox,
  border,
  position,
  visibility,
  boxShadow,
  wordBreak,
];

export const getStyle = (key: string) => {
  const style = styles.find(({ propNames = [] }) => propNames.includes(key));
  return style ? (style as any)[key] : undefined;
};

export const generateStyles = (
  config: {
    [k: string]: any;
  } = {},
  theme: any
): any => {
  if (!Object.keys(config).length) return '';

  return Object.keys(config).reduce(
    (prev, key: string) => ({
      ...prev,
      [key]:
        (theme[
          (
            getStyle(key) || {
              config: {
                [key]: {},
              },
            }
          ).config[key].scale
        ] || {})[config[key]] || config[key],
    }),
    {}
  );
};

export const Box = styled.div<BoxProps>`
  ${styles};
`;

Box.defaultProps = {
  display: 'flex',
  flex: '0 0 auto',
  flexDirection: 'column',
  justifyContent: 'start',
  alignItems: 'stretch',
  fontSize: 0,
};

export default Box;
