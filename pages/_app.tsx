import '../styles/globals.css';
import type { AppProps } from 'next/app';
import CartDrawer from '../components/CartDrawer';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Component {...pageProps} />
      <CartDrawer />
    </>
  );
}
