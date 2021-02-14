import { useState } from 'react';
import { useTranslation } from 'lib/i18n';
import { Form } from 'react-final-form';

import Box from 'components/Box';
import Text from 'components/Text';
import Title from 'components/forms/Title';
import Field from 'components/forms/Field';
import Input from 'components/forms/Input';
import { Button } from 'primereact/button';
import { email, required } from 'components/forms/validators';
import supabase from 'lib/supabase';
import { useRouter } from 'next/router';

interface SignupValues {
  email: string;
  password: string;
}

export const SignupForm = () => {
  const { t } = useTranslation();

  const [error, setError] = useState('');
  const [needValidation, setNeedValidation] = useState(false);

  const submit = async (values: SignupValues) => {
    setError('');
    const { data, error } = await supabase.auth.signUp(values);

    if (error) {
      setError(error.message);
    }
    if (data) {
      setNeedValidation(true);
    }
  };

  if (needValidation) {
    return (
      <Box alignItems="stretch">
        <Title>{t('signup.success')}</Title>
        <Text>{t('signup.needValidation')}</Text>
      </Box>
    );
  }

  return (
    <Form<SignupValues>
      onSubmit={submit}
      validate={(values) => {
        const errors: Partial<SignupValues> = {};

        errors.email = required(values.email) || email(values.email);
        errors.password = required(values.password);

        return errors;
      }}
    >
      {({ handleSubmit, errors, valid, submitting }) => (
        <Box as="form" onSubmit={handleSubmit} alignItems="stretch">
          <Title>{t('signup.title')}</Title>
          <Field label={t('signin.email.label')} name="email">
            <Input type="text" name="email" />
          </Field>
          <Field label={t('signin.password.label')} name="password">
            <Input type="password" name="password" />
          </Field>
          <Box
            justifyContent="flex-start"
            mt={3}
            flexDirection="row"
            alignItems="center"
          >
            {error && (
              <Box
                as="small"
                className="p-error p-d-block"
                ml={3}
                style={{ order: 1 }}
              >
                {error}
              </Box>
            )}
            <Button type="submit" disabled={!valid || submitting}>
              {t('signup.submit')}
            </Button>
          </Box>
        </Box>
      )}
    </Form>
  );
};

export default SignupForm;
