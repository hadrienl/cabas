import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { FC, InputHTMLAttributes, useMemo } from 'react';
import { useField } from 'react-final-form';
interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  feedback?: boolean;
}

const getComponentType = (
  type: InputHTMLAttributes<HTMLInputElement>['type']
): { Component: any; props: any } => {
  switch (type) {
    case 'password':
      return {
        Component: Password,
        props: {
          toggleMask: true,
        },
      };
    default:
      return { Component: InputText, props: {} };
  }
};

export const Input: FC<InputProps> = ({
  type = 'text',
  name = '',
  label,
  ...props
}) => {
  const { input } = useField(name);
  const { Component, props: componentProps } = useMemo(
    () => getComponentType(type),
    [type]
  );

  return <Component {...componentProps} {...input} {...props} />;
};

export default Input;
