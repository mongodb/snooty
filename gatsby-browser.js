import React from 'react';
import { ThemeProvider } from '@emotion/react';
import { theme } from './src/theme/docsTheme';
import './src/styles/mongodb-docs.css';
import './src/styles/icons.css';
import './src/styles/global-dark-mode.css';

export const wrapRootElement = ({ element }) => <ThemeProvider theme={theme}>{element}</ThemeProvider>;

export const shouldUpdateScroll = ({ routerProps: { location } }) => {
  const { hash, state } = location;
  if (hash) {
    return decodeURI(hash.slice(1));
  }
  if (state?.preserveScroll) {
    return false;
  }
  return true;
};
