import { useTranslation } from 'lib/i18n';

import Box from 'components/Box';
import Text from 'components/Text';
import Main from 'components/Main';
import { Button } from 'primereact/button';
import { useUser } from 'components/UserProvider';
import SigninForm from './SigninForm';
import { SignupForm } from './SignupForm';

export const Signin = () => {
  const { t } = useTranslation();
  const { user, signout } = useUser();

  if (user) {
    return (
      <Main>
        <Box alignItems="center" justifyContent="center" flex="1">
          <Text mb={3}>{t('signin.alreadySignedin')}</Text>
          <Button onClick={signout}>{t('signin.signout')}</Button>
        </Box>
      </Main>
    );
  }
  return (
    <Main>
      <Box flexDirection="row" justifyContent="space-evenly">
        <Box flex="1" alignItems="stretch" mr={2}>
          <SigninForm />
        </Box>
        <Box flex="1" alignItems="stretch" ml={2}>
          <SignupForm />
        </Box>
      </Box>
    </Main>
  );
};

export default Signin;
