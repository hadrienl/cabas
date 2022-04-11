import Box, { BoxProps } from 'components/Box';
import Text from 'components/Text';
import { useTranslation } from 'lib/i18n';
import { FC, ReactElement, ReactNode, useEffect, useState } from 'react';
import { FieldRenderProps, useField } from 'react-final-form';

interface FieldProps extends BoxProps {
  name: string;
  label?: string;
  children:
    | ReactNode
    | ((v: {
        field: FieldRenderProps<any, HTMLElement, any>;
        pristine: boolean;
      }) => ReactElement);
}

export const Field: FC<FieldProps> = ({ name, label, children, ...props }) => {
  const field = useField(name);
  const { t } = useTranslation();

  const [pristine, setPristine] = useState(true);
  useEffect(() => {
    if (!pristine) return;
    setPristine(!field.meta.dirty);
  }, [field, pristine]);

  return (
    <Box className="p-field" alignItems="stretch" {...(props as any)}>
      <Box as="label" className="p-d-block" alignItems="stretch">
        <Text my={2}>{label}</Text>
        {typeof children === 'function'
          ? children({ field, pristine })
          : children}
        <Box>
          <Box
            as="small"
            className="p-error p-d-block"
            visibility={!pristine && field.meta.error ? 'visible' : 'hidden'}
          >
            {t(field.meta.error) || '&nbsp'}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Field;
