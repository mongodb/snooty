import { css } from '@leafygreen-ui/emotion';
import { palette } from '@leafygreen-ui/palette';
import { theme } from '../../../theme/docsTheme';

export const sideNavItemBasePadding = css`
  padding-left: ${theme.size.medium};
  padding-right: ${theme.size.medium};
  padding-top: ${theme.size.small};
  padding-bottom: ${theme.size.small};
`;

export const sideNavItemTOCStyling = ({ level = 1 }) => css`
  padding-bottom: ${theme.size.small};
  padding-left: calc(${theme.size.tiny} + (${level} * ${theme.size.default}));
  padding-right: ${theme.size.medium};
  padding-top: ${theme.size.small};
  align-items: flex-start !important;
  font-size: ${theme.fontSize.small};
  text-transform: none;
  line-height: 20px !important;

  // overwrite LG link underlines
  // @leafygreen-ui/typography v13.0.0
  :hover {
    &:after,
    span:after {
      display: none;
    }
  }
`;

export const sideNavItemFontSize = css`
  font-size: ${theme.fontSize.small};
`;

export const titleStyle = css`
  display: flex;
  justify-content: space-between;
  color: var(--sidenav-item-title);
  font-size: ${theme.fontSize.small};
  font-weight: bold;
  line-height: 20px;
  text-transform: none;
  &:hover {
    background-color: var(--sidenav-hover-bg-color);

    &:after,
    span:after {
      display: none;
    }
  }
`;

export const logoLinkStyling = css`
  padding-left: ${theme.size.medium};
  display: flex;
  text-decoration: none;
  width: 162px;

  > svg {
    margin-right: ${theme.size.default};

    > path {
      fill: ${palette.black};
    }
  }

  .dark-theme & {
    > svg > path {
      fill: ${palette.white};
    }
  }
`;
