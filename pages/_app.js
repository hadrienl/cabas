import UserProvider from 'components/UserProvider';
import HeaderProvider from 'components/Header/HeaderProvider';
import BasketProvider from 'components/BasketProvider';

import 'primereact/resources/themes/vela-green/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';

import '../styles/globals.css';

function MyApp({ Component, pageProps }) {
  return (
    <UserProvider>
      <BasketProvider>
        <HeaderProvider>
          <Component {...pageProps} />
        </HeaderProvider>
      </BasketProvider>
    </UserProvider>
  );
}

export default MyApp;
