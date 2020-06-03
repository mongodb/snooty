import React from 'react';
import { ThemeProvider } from 'emotion-theming';
import { theme } from './src/theme/docsTheme';
import DefaultLayout from './src/components/layout';

export const wrapRootElement = ({ element }) => <ThemeProvider theme={theme}>{element}</ThemeProvider>;

export const wrapPageElement = ({ element, props }) => <DefaultLayout {...props}>{element}</DefaultLayout>;
