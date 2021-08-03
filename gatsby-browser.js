import React from 'react';
import { ThemeProvider } from 'emotion-theming';
import LeafyGreenProvider from '@leafygreen-ui/leafygreen-provider';
import { UserProvider } from './src/contexts/user-context';
import { theme } from './src/theme/docsTheme';
import './src/styles/mongodb-docs.css';

export const wrapPageElement = ({ element }) => <UserProvider>{element}</UserProvider>;

export const wrapRootElement = ({ element }) => (
  <ThemeProvider theme={theme}>
    <LeafyGreenProvider baseFontSize={16}>{element}</LeafyGreenProvider>
  </ThemeProvider>
);
