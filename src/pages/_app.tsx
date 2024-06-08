import { GeistSans } from 'geist/font/sans';
import type { AppProps } from 'next/app';

import '~/globals.css';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <main className={GeistSans.className}>
      <Component {...pageProps} />
    </main>
  );
}

export default MyApp;
