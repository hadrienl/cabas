import { useUser } from 'components/UserProvider';
import AccountLayout from './AccountLayout';

export const AccountIndex = () => {
  const { user } = useUser();

  if (!user) return null;

  return <AccountLayout>Yo</AccountLayout>;
};

export default AccountIndex;
