import UserProvider from 'components/UserProvider';
import HeaderProvider from 'components/Header/HeaderProvider';
import BasketProvider from 'components/BasketProvider';

import 'primereact/resources/themes/vela-green/theme.css';
//import 'primereact/resources/themes/saga-green/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';

import '../styles/globals.scss';

function MyApp({ Component, pageProps }) {
  const getLayout = Component.getLayout ?? ((page) => page);

  return (
    <UserProvider>
      <BasketProvider>
        <HeaderProvider>
          {getLayout(<Component {...pageProps} />)}
        </HeaderProvider>
      </BasketProvider>
    </UserProvider>
  );
}

export default MyApp;
