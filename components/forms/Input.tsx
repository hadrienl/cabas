import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { FC, useMemo } from 'react';
import { useField } from 'react-final-form';

type InputType = 'text' | 'password';
interface InputProps {
  type: InputType;
  name: string;
  label?: string;
  feedback?: boolean;
}

const getComponentType = (type: InputType): { Component: any; props: any } => {
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

export const Input: FC<InputProps> = ({ type, name, label, ...props }) => {
  const { input } = useField(name);
  const { Component, props: componentProps } = useMemo(
    () => getComponentType(type),
    [type]
  );

  return <Component {...componentProps} {...input} {...props} />;
};

export default Input;
