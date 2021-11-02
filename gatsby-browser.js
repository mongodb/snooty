import React from 'react';
import { ThemeProvider } from 'emotion-theming';
import LeafyGreenProvider from '@leafygreen-ui/leafygreen-provider';
import { theme } from './src/theme/docsTheme';
import './src/styles/mongodb-docs.css';

// Delay for when page should scroll. Gives time for content in tab components to render
const contentTransitionDuration = theme.size.stripUnit(theme.transitionSpeed.contentFade);

// Slight modification to the default behavior of Gatsby's shouldUpdateScroll function.
// We only want to perform scroll location updates through Gatsby Links after the page transitions are over.
// https://github.com/gatsbyjs/gatsby/blob/069cb535fa5bf5d2eead31533be18b1fe64c2568/packages/gatsby-react-router-scroll/src/scroll-handler.tsx#L102
export const shouldUpdateScroll = ({ routerProps: { location }, getSavedScrollPosition }) => {
  const { hash } = location;
  const currentPos = getSavedScrollPosition(location);

  const decodeUriAndScroll = () => {
    try {
      const uri = decodeURI(hash);
      const targetEl = document.getElementById(uri.slice(1));
      if (targetEl) {
        targetEl.scrollIntoView();
      }
    } catch (e) {
      console.error(e);
    }
  };

  window.setTimeout(() => {
    hash ? decodeUriAndScroll() : window.scrollTo(...(currentPos || [0, 0]));
  }, contentTransitionDuration);

  // Prevent Gatsby from performing its default scroll behavior after clicking on a link
  return false;
};

export const wrapRootElement = ({ element }) => (
  <ThemeProvider theme={theme}>
    <LeafyGreenProvider baseFontSize={16}>{element}</LeafyGreenProvider>
  </ThemeProvider>
);
