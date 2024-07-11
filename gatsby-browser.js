import React from 'react';
import { ThemeProvider } from '@emotion/react';
import { theme } from './src/theme/docsTheme';
import './src/styles/mongodb-docs.css';
import './src/styles/icons.css';
import './src/styles/global-dark-mode.css';

export const wrapRootElement = ({ element }) => <ThemeProvider theme={theme}>{element}</ThemeProvider>;

export const shouldUpdateScroll = ({ routerProps: { location } }) => {
  if (location?.hash?.length > 1) {
    return location?.hash.slice(1) || false;
  }
  if (location?.state?.preserveScroll) {
    return false;
  }
  return true;
};
