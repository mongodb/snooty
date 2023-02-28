import React from 'react';
import { ThemeProvider } from '@emotion/react';
import LeafyGreenProvider from '@leafygreen-ui/leafygreen-provider';
import { theme } from './src/theme/docsTheme';
import './src/styles/mongodb-docs.css';
import './src/styles/icons.css';
import IndexLayout from './src/layouts/index';
import PreviewLayout from './src/layouts/preview-layout';
import { useSiteMetadata } from './src/hooks/use-site-metadata';
import { isFullBuild } from './src/utils/is-full-build';

export const wrapRootElement = ({ element }) => (
  <ThemeProvider theme={theme}>
    <LeafyGreenProvider baseFontSize={16}>{element}</LeafyGreenProvider>
  </ThemeProvider>
);

// React component wrapper for hook usage. TODO: separate this into its own component file for both browser and ssr
const LayoutWrapper = ({ children, pageContext }) => {
  const { snootyEnv } = useSiteMetadata();
  // TODO: Gatsby v4 will enable code splitting automatically. Delete duplicate components, add conditional for consistent-nav UnifiedNav in DefaultLayout
  const Layout = isFullBuild(snootyEnv) ? IndexLayout : PreviewLayout;
  return <Layout pageContext={pageContext}>{children}</Layout>;
};

export const wrapPageElement = ({ element, props }) => <LayoutWrapper {...props}>{element}</LayoutWrapper>;
