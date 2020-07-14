import React from 'react';
import { ThemeProvider } from 'emotion-theming';
import { theme } from './src/theme/docsTheme';

export const wrapRootElement = ({ element }) => <ThemeProvider theme={theme}>{element}</ThemeProvider>;
