import React from 'react';
import { ThemeProvider } from '@emotion/react';
import { theme } from './src/theme/docsTheme';
import './src/styles/mongodb-docs.css';
import './src/styles/icons.css';

export const wrapRootElement = ({ element }) => <ThemeProvider theme={theme}>{element}</ThemeProvider>;

export const shouldUpdateScroll = ({ routerProps: { location } }) => {
  if (location?.state?.preserveScroll) {
    return false;
  }
  return true;
};
