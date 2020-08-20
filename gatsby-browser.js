import React from 'react';
import { ThemeProvider } from 'emotion-theming';
import LeafyGreenProvider from '@leafygreen-ui/leafygreen-provider';
import { theme } from './src/theme/docsTheme';
import DefaultLayout from './src/components/layout';

export const wrapRootElement = ({ element }) => <ThemeProvider theme={theme}>{element}</ThemeProvider>;

export const wrapPageElement = ({ element, props }) => (
  <LeafyGreenProvider>
    <DefaultLayout {...props}>{element}</DefaultLayout>
  </LeafyGreenProvider>
);
