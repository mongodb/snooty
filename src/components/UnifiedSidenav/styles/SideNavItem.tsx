import { css } from '@leafygreen-ui/emotion';
import { theme } from '../../../theme/docsTheme';

export const sideNavItemBasePadding = css`
  overwrite LG link underlines @leafygreen-ui/typography v13.0.0 :hover {
    &:after,
    span:after {
      display: none;
    }
  }
`;

export const backLinkStyling = css`
  ${sideNavItemBasePadding}
  padding-left: ${theme.size.default};
  padding-top: ${theme.size.small};
  font-size: ${theme.fontSize.small};

  :hover {
    text-decoration: none;
  }
`;

export const l1ItemStyling = ({ isActive }: { isActive: boolean }) => css`
  ${sideNavItemBasePadding}
  padding-left: ${theme.size.medium};
  padding-right: ${theme.size.medium};
  padding-top: ${theme.size.default};
  padding-bottom: ${theme.size.default};
  font-weight: 500;
  font-size: 12px;
  line-height: 16px;
  text-transform: uppercase;

  ${isActive && css`
    font-weight: 600;
    color: var(--sidenav-active-before-color) !important;
    background-color: var(--sidenav-active-bg-color);
  `}
`;

export const groupHeaderStyling = () => css`
  div > div {
    font-weight: 500;
    color: var(--tab-color-primary);
  }
`;

export const l2ItemStyling = ({ level }: { level: number }) => css`
  ${sideNavItemBasePadding}
  line-height: 20px;
  font-size: ${theme.fontSize.small};
  padding-left: calc(16px + ${(level - 1) * 25}px);

  // Hides the left tab on Active Selection
  &[aria-current='page'] {
    font-weight: 400;
    color: var(--font-color-active) !important;
    background-color: var(--sidenav-active-bg-color);
  }

  ::before {
    display: none;
  }
`;
