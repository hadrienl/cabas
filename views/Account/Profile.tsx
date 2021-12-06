import { useCallback, useMemo, useState } from 'react';
import { Form } from 'react-final-form';
import { Button } from 'primereact/button';

import Box from 'components/Box';
import Field from 'components/forms/Field';
import Input from 'components/forms/Input';
import Title from 'components/forms/Title';
import Text from 'components/Text';
import { useUser } from 'components/UserProvider';
import { useTranslation } from 'lib/i18n';
import { Customer } from 'types/Entities';
import AccountLayout from './Layout';

interface FormFields extends Customer {
  email: string;
}

export const Profile = () => {
  const { t } = useTranslation();
  const { user, customer, updateUser, updateProfile } = useUser();
  const [error, setError] = useState('');
  const breadcrumbs = useMemo(
    () => [
      {
        label: t('account.profile.title'),
        url: '/account/profile',
      },
    ],
    [t]
  );

  const onSubmit = useCallback(
    async ({ email, ...values }) => {
      if (!user || (email !== user.new_email && email !== user.email)) {
        await updateUser({ email });
      }
      await updateProfile(values);
    },
    [updateProfile, updateUser, user]
  );

  const initialValues = useMemo(
    () => ({
      email: user ? user.new_email || user.email : '',
      ...customer,
    }),
    [customer, user]
  );

  return (
    <AccountLayout breadcrumbs={breadcrumbs}>
      <Form<FormFields> onSubmit={onSubmit} initialValues={initialValues}>
        {({ handleSubmit, valid, submitting }) => (
          <Box as="form" onSubmit={handleSubmit}>
            <Title>{t('account.profile.title')}</Title>
            <Field
              name="firstName"
              label={t('account.profile.firstName.label')}
            >
              <Input type="text" name="firstName" />
            </Field>

            <Field name="lastName" label={t('account.profile.lastName.label')}>
              <Input type="text" name="lastName" />
            </Field>

            <Field name="email" label={t('account.profile.email.label')}>
              <Input type="email" name="email" />
              {user && user.new_email && (
                <Text mt={2} alignItems="center" color="orange">
                  <Box className="pi pi-exclamation-triangle" mr={2} />
                  {t('account.profile.email.changed')}
                </Text>
              )}
            </Field>

            <Field name="phone" label={t('account.profile.phone.label')}>
              <Input type="text" name="phone" />
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

export default Profile;
