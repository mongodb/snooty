import React from 'react';
import { ThemeProvider } from 'emotion-theming';
import LeafyGreenProvider from '@leafygreen-ui/leafygreen-provider';
import { CONTENT_CONTAINER_CLASSNAME } from './src/constants';
import { theme } from './src/theme/docsTheme';
import './src/styles/mongodb-docs.css';

// Delay for when page should scroll. Gives time for content in tab components to render
const contentTransitionDuration = theme.size.stripUnit(theme.transitionSpeed.contentFadeOut);

// Take control of the scroll for our main content's scroll container.
// By default, Gatsby controls the scroll of the window object, which doesn't work
// for our use case.
// https://github.com/gatsbyjs/gatsby/blob/069cb535fa5bf5d2eead31533be18b1fe64c2568/packages/gatsby-react-router-scroll/src/scroll-handler.tsx#L102
export const shouldUpdateScroll = ({ routerProps: { location } }) => {
  const { hash } = location;
  const scrollContainer = document.querySelector(`.${CONTENT_CONTAINER_CLASSNAME}`);

  if (scrollContainer) {
    if (hash) {
      window.setTimeout(() => {
        let uri;

        try {
          uri = decodeURI(hash);
        } catch (e) {
          console.error(e);
        }

        document.getElementById(uri.slice(1)).scrollIntoView(true);
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
