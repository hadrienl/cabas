import styled from 'styled-components';
import Text from 'components/Text';

export const Title = styled(Text)``;
Title.defaultProps = {
  ...Text.defaultProps,
  mb: 3,
};
export default Title;
