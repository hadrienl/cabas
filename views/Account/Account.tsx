import Box from 'components/Box';
import { useUser } from 'components/UserProvider';
import { useTranslation } from 'lib/i18n';
import AccountLayout from './Layout';

export const AccountIndex = () => {
  const { t } = useTranslation();
  const { user } = useUser();

  if (!user) return null;

  return (
    <AccountLayout>
      <Box>{t('account.welcome')}</Box>
    </AccountLayout>
  );
};

export default AccountIndex;
