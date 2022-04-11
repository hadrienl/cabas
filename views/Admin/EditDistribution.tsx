import { Calendar } from 'primereact/calendar';
import Box from 'components/Box';
import { Button } from 'primereact/button';
import Field from 'components/forms/Field';
import Title from 'components/forms/Title';
import { Form } from 'react-final-form';
import { Distribution } from 'types/Entities';

interface EditDistributionProps {
  distribution: Partial<Distribution>;
  onSubmit: (values: Distribution) => void;
}

export const EditDistribution = ({
  distribution,
  onSubmit,
}: EditDistributionProps) => {
  return (
    <Form onSubmit={onSubmit} initialValues={distribution}>
      {({ handleSubmit, values }) => (
        <Box as="form" onSubmit={handleSubmit}>
          <Title>Ajouter une distribution</Title>
          <Field name="startAt" label="Démarre le">
            {({ field }) => (
              <Calendar
                {...field.input}
                value={new Date(field.input.value || '')}
              />
            )}
          </Field>
          <Field name="closeAt" label="Se termine le">
            {({ field }) => (
              <Calendar
                {...field.input}
                value={new Date(field.input.value || '')}
                minDate={new Date(values.startAt)}
              />
            )}
          </Field>
          <Field name="shipAt" label="Livraison le">
            {({ field }) => (
              <Calendar
                {...field.input}
                value={new Date(field.input.value || '')}
                minDate={new Date(values.closeAt)}
              />
            )}
          </Field>
          <Button type="submit">Enregistrer</Button>
        </Box>
      )}
    </Form>
  );
};

export default EditDistribution;
