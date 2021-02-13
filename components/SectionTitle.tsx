import styled from 'styled-components';
import { BoxProps } from './Box';
import Text from './Text';

export const SectionTitle = styled(Text)<BoxProps>``;
SectionTitle.defaultProps = {
  ...Text.defaultProps,
  padding: 0,
  marginY: '3',
};
export default SectionTitle;
