import Box from 'components/Box';
import supabase from 'lib/supabase';
import { useForm } from 'react-hook-form';
import AccountLayout from '../AccountLayout';

export const Password = () => {
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

  return (
    <AccountLayout>
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
