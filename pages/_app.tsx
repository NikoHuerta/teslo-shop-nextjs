import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { SessionProvider } from 'next-auth/react';
import { PayPalScriptProvider } from "@paypal/react-paypal-js";

import { CssBaseline, ThemeProvider } from '@mui/material';
import { SWRConfig } from 'swr';
import { SnackbarProvider } from 'notistack';

import { lightTheme } from '../themes';
import { AuthProvider, CartProvider, UIProvider } from '../context';

function MyApp({ Component, pageProps }: AppProps) {
  return (

    <SessionProvider>
      <PayPalScriptProvider options={{ 'client-id': process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || '' }}>
      <SWRConfig 
        value={{
          // refreshInterval: 500,
          fetcher: (resource, init) => fetch(resource, init).then(res => res.json())
        }}
      >
        <AuthProvider>
          <CartProvider>
            <UIProvider>
              <ThemeProvider theme={ lightTheme }>
                <SnackbarProvider maxSnack={3}>
                  <CssBaseline />
                  <Component {...pageProps} />
                </SnackbarProvider>
              </ThemeProvider>
            </UIProvider>
          </CartProvider>
        </AuthProvider>

      </SWRConfig>
      </PayPalScriptProvider>

    </SessionProvider>



  )
}

export default MyApp
