import UserProvider from 'components/UserProvider';
import HeaderProvider from 'components/Header/HeaderProvider';
import { appWithTranslation } from 'lib/i18n';

import 'primereact/resources/themes/vela-green/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';

import '../styles/globals.css';

function MyApp({ Component, pageProps }) {
  return (
    <UserProvider>
      <HeaderProvider>
        <Component {...pageProps} />
      </HeaderProvider>
    </UserProvider>
  );
}

export default appWithTranslation(MyApp);
