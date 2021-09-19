import Box from 'components/Box';
import styled from 'styled-components';

export const CardContainer = styled(Box)`
  * {
    --text-color: black;
  }
`;
CardContainer.defaultProps = {
  ...Box.defaultProps,
  width: [
    'calc(100% - 20px)',
    'calc(100% / 2 - 20px)',
    'calc(100% / 3 - 20px)',
  ],
  margin: '10px',
  backgroundColor: 'white',
  boxShadow: '0 0 10px rgba(0,0,0,.8)',
  color: 'black',
  padding: '10px',
  borderRadius: 4,
};

export default CardContainer;
