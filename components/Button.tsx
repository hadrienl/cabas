import * as React from 'react';

import styled from 'styled-components';
import Box from './Box';

export const Button = styled(Box).attrs<
  React.ButtonHTMLAttributes<HTMLButtonElement>
>({
  as: 'button',
  type: 'button',
  border: 0,
  backgroundColor: 'transparent',
  color: 'var(--text-color)',
  cursor: 'pointer',
})``;

export default Button;
