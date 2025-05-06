import { css } from '@leafygreen-ui/emotion';
// import { palette } from '@leafygreen-ui/palette';
import { theme } from '../../../theme/docsTheme';

export const sideNavItemBasePadding = css`
  overwrite LG link underlines @leafygreen-ui/typography v13.0.0 :hover {
    &:after,
    span:after {
      display: none;
    }
  }
`;

export const backLinkStyling = () => css`
  ${sideNavItemBasePadding}
  padding-left: ${theme.size.default};
  padding-top: ${theme.size.small};
  font-size: ${theme.fontSize.small} !important;
  :hover {
    text-decoration: none !important;
  }
`;

export const L1ItemStlying = () => css`
  ${sideNavItemBasePadding}
  padding-left: ${theme.size.medium};
  padding-right: ${theme.size.medium};
  padding-top: ${theme.size.default};
  padding-bottom: ${theme.size.default};
  font-weight: 500 !important;
  font-size: 12px !important;
  line-height: 16px !important;
  text-transform: uppercase;

  &[aria-current='page'] {
    font-weight: 600 !important;
    color: var(--sidenav-active-before-color) !important;
    background-color: var(--sidenav-active-bg-color);
  }
`;
export const groupHeaderStyling = () => css`
  div > div {
    font-weight: 500;
    color: var(--tab-color-primary);
  }
`;

export const L2ItemStlying = ({ level }) => css`
  ${sideNavItemBasePadding}
  line-height: 20px !important;
  font-size: ${theme.fontSize.small};
  padding-left: calc(16px + ${(level - 1) * 25}px);
  // Hides the left tab on Active Selection
  &[aria-current='page'] {
    font-weight: 400;
    color: var(--font-color-active) !important;
    background-color: var(--sidenav-active-bg-color);
  }
  ::before {
    display: none !important;
  }
`;