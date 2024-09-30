import React from 'react';
import { ApolloProvider } from '@apollo/client';
import client from '../lib/apolloClient';
import { CssBaseline } from '@mui/material';
import "./../styles/globals.css"

const MyApp = ({ Component, pageProps }:any) => {
  return (
    <ApolloProvider client={client}>
      <CssBaseline />
      <Component {...pageProps} />
    </ApolloProvider>
  );
};

export default MyApp;