import Box, { BoxProps } from 'components/Box';
import Text from 'components/Text';
import { useTranslation } from 'lib/i18n';
import { FC, useEffect, useMemo, useState } from 'react';
import { useField } from 'react-final-form';

interface FieldProps extends BoxProps {
  name: string;
  label?: string;
}

export const Field: FC<FieldProps> = ({ name, label, children, ...props }) => {
  const {
    meta: { dirty, error },
  } = useField(name);
  const { t } = useTranslation();

  const [pristine, setPristine] = useState(true);
  useEffect(() => {
    if (!pristine) return;
    setPristine(!dirty);
  }, [dirty]);

  return (
    <Box className="p-field" alignItems="stretch" {...(props as any)}>
      <Box as="label" className="p-d-block" alignItems="stretch">
        <Text my={2}>{label}</Text>
        {children}
        <Box>
          <Box
            as="small"
            className="p-error p-d-block"
            visibility={!pristine && error ? 'visible' : 'hidden'}
          >
            {t(error) || '&nbsp'}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Field;
