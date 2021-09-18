import styled from 'styled-components';
import Box, { BoxProps } from './Box';

const StyledText = styled(Box)<BoxProps>``;

export const Text = ({ ...props }) => {
  return <StyledText {...props} />;
};
Text.defaultProps = {
  ...Box.defaultProps,
  color: 'var(--text-color)',
};
export default Text;
