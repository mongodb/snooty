import React from 'react';
import { ThemeProvider } from 'emotion-theming';
import LeafyGreenProvider from '@leafygreen-ui/leafygreen-provider';
import { CONTENT_CONTAINER_CLASSNAME } from './src/constants';
import { theme } from './src/theme/docsTheme';
import './src/styles/mongodb-docs.css';

const contentTransitionDuration = 100;

export const shouldUpdateScroll = ({ routerProps: { location } }) => {
  const { hash } = location;
  const scrollContainer = document.querySelector(`.${CONTENT_CONTAINER_CLASSNAME}`);

  // Clicking on a new link
  if (scrollContainer) {
    if (hash) {
      window.setTimeout(() => {
        document.getElementById(decodeURI(hash).slice(1)).scrollIntoView(true);
      }, contentTransitionDuration);
    } else {
      window.setTimeout(() => {
        scrollContainer.scrollTop = 0;
      }, contentTransitionDuration);
    }
  }

  return false;
};

export const wrapRootElement = ({ element }) => (
  <ThemeProvider theme={theme}>
    <LeafyGreenProvider baseFontSize={16}>{element}</LeafyGreenProvider>
  </ThemeProvider>
);
