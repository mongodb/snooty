import React from 'react';
// use prefix
import { ThemeProvider } from '@emotion/react';
import LeafyGreenProvider from '@leafygreen-ui/leafygreen-provider';
import { theme } from './src/theme/docsTheme';
import './src/styles/mongodb-docs.css';
import './src/styles/icons.css';

export const wrapRootElement = ({ element }) => (
  <ThemeProvider theme={theme}>
    <LeafyGreenProvider baseFontSize={16}>{element}</LeafyGreenProvider>
  </ThemeProvider>
);

export const shouldUpdateScroll = ({ routerProps: { location }, _getSavedScrollPosition }) => {
  // stage and log that prefix
  // seung.park/DOP-xxxx/landing/search  ???????
  if (location.pathname === '/search/') {
    return false;
  }
  return true;
};
