import Box from 'components/Box';
import Text from 'components/Text';
import { FC } from 'react';
import { useField } from 'react-final-form';

interface FieldProps {
  name: string;
  label?: string;
}

export const Field: FC<FieldProps> = ({ name, label, children }) => {
  const {
    meta: { dirty, error },
  } = useField(name);
  return (
    <Box className="p-field">
      <Box as="label" className="p-d-block">
        <Text my={2}>{label}</Text>
        {children}
        <Box my={2}>
          {dirty && error && (
            <Box as="small" className="p-error p-d-block">
              {error}
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default Field;
