import { useState } from 'react';
import { useTranslation } from 'lib/i18n';
import { Form } from 'react-final-form';

import Box from 'components/Box';
import Text from 'components/Box';
import Title from 'components/forms/Title';
import Field from 'components/forms/Field';
import Input from 'components/forms/Input';
import { Button } from 'primereact/button';
import { required } from 'components/forms/validators';
import supabase from 'lib/supabase';
import { useRouter } from 'next/router';

interface SigninValues {
  email: string;
  password: string;
}

export const SigninForm = () => {
  const { t } = useTranslation();
  const { push } = useRouter();

  const [error, setError] = useState('');
  const [withEmail, setWithEmail] = useState(false);
  const [withForgot, setWithForgot] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const submit = async (values: SigninValues) => {
    setError('');
    if (withForgot) {
      const { error } = await supabase.auth.api.resetPasswordForEmail(
        values.email
      );
      if (error) {
        setError(error.message);
      }
      setEmailSent(true);
      return;
    }
    const { error } = await supabase.auth.signIn(values);

    if (error) {
      setError(error.message);
    }
    if (withEmail) {
      setEmailSent(true);
      return;
    }
    push('/');
  };

  const toggleWith = () => {
    setWithEmail(!withEmail);
  };

  const toggleForgot = () => {
    setWithForgot(!withForgot);
    setWithEmail(true);
  };

  if (emailSent) {
    return (
      <Box alignItems="stretch">
        <Title>{t('signin.success')}</Title>
        <Text>{t('signin.readEmail')}</Text>
      </Box>
    );
  }
  return (
    <Form<SigninValues>
      onSubmit={submit}
      validate={(values) => {
        const errors: Partial<SigninValues> = {};

        errors.email = required(values.email);
        errors.password = withEmail ? undefined : required(values.password);

        return errors;
      }}
    >
      {({ handleSubmit, valid, submitting, modifiedSinceLastSubmit }) => (
        <Box as="form" onSubmit={handleSubmit} alignItems="stretch">
          <Title>{t('signin.title')}</Title>
          <Field label={t('signin.email.label')} name="email">
            <Input type="text" name="email" />
          </Field>

          <Field
            label={t('signin.password.label')}
            name="password"
            visibility={withEmail ? 'hidden' : 'visible'}
          >
            <Input type="password" name="password" feedback={false} />
          </Field>
          <Box
            justifyContent="flex-end"
            mt={3}
            flexDirection="row"
            alignItems="flex-start"
          >
            {!modifiedSinceLastSubmit && error && (
              <Box as="small" className="p-error p-d-block" mr={3} flex="auto">
                {error}
              </Box>
            )}
            {(modifiedSinceLastSubmit || !error) && (
              <Box as="small" className="p-error p-d-block" mr={3} flex="1">
                <Button
                  type="button"
                  className="p-button-link"
                  onClick={toggleWith}
                >
                  {t(`signin.${withEmail ? 'withPassword' : 'withEmail'}`)}
                </Button>
                {!withEmail && (
                  <Button
                    type="button"
                    className="p-button-link"
                    onClick={toggleForgot}
                  >
                    Mot de passe oublié ?
                  </Button>
                )}
              </Box>
            )}
            <Button type="submit" disabled={!valid || submitting}>
              {t('signin.submit', {
                context: withForgot ? 'forgot' : withEmail ? 'email' : '',
              })}
            </Button>
          </Box>
        </Box>
      )}
    </Form>
  );
};

export default SigninForm;
