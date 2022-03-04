import Box from 'components/Box';
import Field from 'components/forms/Field';
import Input from 'components/forms/Input';
import { Button } from 'primereact/button';
import { Form } from 'react-final-form';
import { OverlayContent } from './types';

export const PriceSelector = ({ id, onChange }: OverlayContent) => {
  const submit = (values: any) => {
    onChange({ id, ...values });
  };
  return (
    <Form
      onSubmit={submit}
      initialValues={{ unit: 1 }}
      validate={(values) => {
        const errors: any = {};
        if (!values.price) {
          errors.price = 'invalid';
        }
        return errors;
      }}
    >
      {({ handleSubmit }) => (
        <Box as="form" onSubmit={handleSubmit} m={2}>
          <Field name="price" label="Prix">
            <Input name="price" type="number" />
          </Field>
          <Field name="unit" label="Unit">
            <Input name="unit" />
          </Field>
          <Field name="unitLabel" label="Libellé">
            <Input name="unitLabel" />
          </Field>
          <Field name="perUnit" label="Number per unit">
            <Input name="perUnit" />
          </Field>
          <Button type="submit">Ajouter</Button>
        </Box>
      )}
    </Form>
  );
};

export default PriceSelector;
