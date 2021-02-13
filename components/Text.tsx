import styled from 'styled-components';
import Box, { BoxProps } from './Box';

const Text = styled(Box)<BoxProps>``;
Text.defaultProps = {
  ...Box.defaultProps,
  color: 'var(--text-color)',
};
export default Text;
