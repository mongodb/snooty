import { Theme } from '@leafygreen-ui/lib';
import { palette } from '@leafygreen-ui/palette';

/**
 * @typedef ThemeStyle
 * @type {object}
 * @property {string} headingColor
 * @property {string} boxShadow
 * @property {string} boxShadowOnHover
 */
export const SEARCH_THEME_STYLES = {
  [Theme.Light]: {
    headingColor: palette.green.dark2,
    boxShadow: '0px 0px 3px 0px rgba(0, 0, 0, 0.1)',
    boxShadowOnHover: '0px 0px 5px 1px rgba(58, 63, 60, 0.15)',
    filterHeaderColor: palette.gray.dark2,
    searchResultTitleColor: palette.blue.base,
    searchResultTitleColorOnVisited: palette.purple.dark2,
  },
  [Theme.Dark]: {
    headingColor: palette.gray.light2,
    boxShadow: '0px 0px 3px 0px rgba(255, 255, 255, 0.15)',
    boxShadowOnHover: '0px 0px 5px 3px rgba(92, 97, 94, 0.15)',
    filterHeaderColor: palette.gray.light2,
    searchResultTitleColor: palette.blue.light1,
    searchResultTitleColorOnVisited: palette.purple.light2,
  },
};
