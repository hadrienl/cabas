import { InputTextarea, InputTextareaProps } from 'primereact/inputtextarea';
import { FC } from 'react';
import { useField } from 'react-final-form';
interface TextAreaProps extends InputTextareaProps {}

export const TextArea: FC<TextAreaProps> = ({ name = '', ...props }) => {
  const { input } = useField(name);

  return <InputTextarea {...input} {...props} />;
};

export default TextArea;
