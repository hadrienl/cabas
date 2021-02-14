import { useMemo } from 'react';
import { useForm } from 'react-hook-form';

import Box from 'components/Box';
import supabase from 'lib/supabase';
import AccountLayout from './Layout';
import { useTranslation } from 'lib/i18n';

export const Password = () => {
  const { t } = useTranslation();
  const { register, handleSubmit, errors, setError, getValues } = useForm();
  const session = supabase.auth.session();

  if (!session) return null;

  const onSubmit = async ({ password }: { password: string }) => {
    const { error } = await supabase.auth.api.updateUser(session.access_token, {
      password,
    });
    if (error) {
      setError('password', { message: error.message });
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
      <Box as="form" onSubmit={handleSubmit(onSubmit)}>
        <Box
          as="input"
          type="password"
          name="password"
          ref={register({ required: true })}
        />
        {errors.password && <span>{errors.password.message}</span>}
        <Box
          as="input"
          name="check"
          type="password"
          ref={register({
            validate: (value) => {
              return (
                value === getValues('password') ||
                'Le mot de passe est différent'
              );
            },
          })}
        />
        {errors.check && <span>{errors.check.message}</span>}

        <Box as="button" type="submit">
          Enregistrer
        </Box>
      </Box>
    </AccountLayout>
  );
};

export default Password;
