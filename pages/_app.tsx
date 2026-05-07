import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { useRouter } from 'next/router';
import CartDrawer from '../components/CartDrawer';

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const isAdminRoute = router.pathname.startsWith('/admin');

  return (
    <>
      <Component {...pageProps} />
      {!isAdminRoute && <CartDrawer />}
    </>
  );
}
