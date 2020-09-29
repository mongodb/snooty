import React from 'react';
import { ThemeProvider } from 'emotion-theming';
import { renderStylesToString } from '@leafygreen-ui/emotion';
import LeafyGreenProvider from '@leafygreen-ui/leafygreen-provider';
import { renderToString } from 'react-dom/server';
import { theme } from './src/theme/docsTheme';

// Support SSR for LeafyGreen components
// https://github.com/mongodb/leafygreen-ui/tree/master/packages/emotion#server-side-rendering
export const replaceRenderer = ({ replaceBodyHTMLString, bodyComponent }) =>
  replaceBodyHTMLString(renderStylesToString(renderToString(bodyComponent)));

export const wrapRootElement = ({ element }) => (
  <ThemeProvider theme={theme}>
    <LeafyGreenProvider baseFontSize={16}>{element}</LeafyGreenProvider>
  </ThemeProvider>
);
