import { useHeader } from 'components/Header/HeaderProvider';
import { useUser } from 'components/UserProvider';
import { useTranslation } from 'lib/i18n';
import AccountLayout from './AccountLayout';

export const AccountIndex = () => {
  const { t } = useTranslation();
  const { user } = useUser();

  if (!user) return null;

  return <AccountLayout>Yo</AccountLayout>;
};

export default AccountIndex;
