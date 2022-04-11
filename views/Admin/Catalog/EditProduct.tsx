import Box from 'components/Box';
import Field from 'components/forms/Field';
import Input from 'components/forms/Input';
import Title from 'components/forms/Title';
import { Form } from 'react-final-form';
import { InputTextarea } from 'primereact/inputtextarea';
import { ChangeEvent, useCallback, useState } from 'react';
import { Button } from 'primereact/button';
import { Producer, Product } from 'types/Entities';
import TextArea from 'components/forms/TextArea';

interface EditProductProps {
  product?: Partial<Product>;
  onSubmit: (values: Product) => void;
}

export const EditProduct = ({ product, onSubmit }: EditProductProps) => {
  const [photo, setPhoto] = useState(product ? product.photo : '');
  const readFile = ({ target }: ChangeEvent<HTMLInputElement>) => {
    if (!target.files) return;
    const file = target.files[0];
    target.value = '';
    const reader = new FileReader();
    reader.onload = ({ target }) => {
      if (!target || !target.result) return;
      setPhoto(target.result.toString());
    };
    reader.readAsDataURL(file);
  };
  const save = useCallback(
    (values: any) => {
      onSubmit({ ...values, photo });
    },
    [onSubmit, photo]
  );
  return (
    <Form onSubmit={save} initialValues={product}>
      {({ handleSubmit }) => (
        <Box as="form" onSubmit={handleSubmit}>
          <Title>Ajouter un produit</Title>
          <Field name="name" label="Nom">
            <Input name="name" />
          </Field>
          <Field name="description" label="Description">
            <TextArea name="description" autoResize rows={10} />
          </Field>
          <Field name="photo" label="Photo">
            <input
              type="file"
              onChange={readFile}
              accept="image/jpeg,image/png,image/gif,image/heic"
            />
            {photo && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={photo} alt="" />
            )}
          </Field>
          <Button type="submit">Send</Button>
        </Box>
      )}
    </Form>
  );
};

export default EditProduct;
