import { GlobalProviders } from './src/global-context-providers';

import { ThemeProvider } from '@emotion/react';
import { theme } from '../../src/theme/docsTheme';

console.log('gatsby-source-snooty-prod gatsby-ssr');

export function wrapRootElement({ element }) {
  // throw new Error('This is a test to confirm SSR is using wrapRootElement 2');

  return (
    // <ThemeProvider theme={theme}>
      <GlobalProviders element={element} />
    // </ThemeProvider>
  );
}
