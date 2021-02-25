import { css } from '@emotion/core';
import { theme } from '../theme/docsTheme';

const mediaQuery = (size) => css`
  @media ${size} {
    display: none;
  }
`;

// Add "display: none" to a component's css based on size for media query
export const displayNone = {
  onMobile: mediaQuery(theme.screenSize.upToSmall),
  onLargerThanMobile: mediaQuery(theme.screenSize.smallAndUp),
  onMobileAndTablet: mediaQuery(theme.screenSize.upToLarge),
};
