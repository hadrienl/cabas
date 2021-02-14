import { useMemo, useState } from 'react';
import { Form, useForm } from 'react-final-form';

import Box from 'components/Box';
import Text from 'components/Text';
import supabase from 'lib/supabase';
import AccountLayout from './Layout';
import { useTranslation } from 'lib/i18n';
import Input from 'components/forms/Input';
import Field from 'components/forms/Field';
import { Button } from 'primereact/button';

interface FormFields {
  password: string;
  check: string;
}

export const Password = () => {
  const { t } = useTranslation();
  const session = supabase.auth.session();
  const [error, setError] = useState('');

  if (!session) return null;

  const onSubmit = async ({ password }: { password: string }) => {
    const { error } = await supabase.auth.api.updateUser(session.access_token, {
      password,
    });
    if (error) {
      setError(error.message);
    }
  };

  const breadcrumbs = useMemo(
    () => [
      {
        label: t('account.password.title'),
        url: '/account/password',
      },
    ],
    []
  );

  return (
    <AccountLayout breadcrumbs={breadcrumbs}>
      <Form<FormFields>
        onSubmit={onSubmit}
        validate={(values) => {
          const errors: Partial<FormFields> = {};
          if (values.check !== values.password) {
            errors.check = t('account.password.error.different');
          }
          return errors;
        }}
      >
        {({ handleSubmit, valid, submitting }) => (
          <Box as="form" onSubmit={handleSubmit}>
            <Text mb={3}>{t('account.password.title')}</Text>
            <Field name="password" label={t('account.password.label')}>
              <Input type="password" name="password" />
            </Field>
            <Field
              name="check"
              label={t('account.password.label', { context: 'check' })}
            >
              <Input type="password" name="check" feedback={false} />
            </Field>
            <Button type="submit" disabled={!valid || submitting}>
              {t('generic.save')}
            </Button>
            {error && (
              <Box as="small" className="p-error p-d-block">
                {error}
              </Box>
            )}
          </Box>
        )}
      </Form>
    </AccountLayout>
  );
};

export default Password;
