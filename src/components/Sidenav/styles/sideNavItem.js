import { css } from '@leafygreen-ui/emotion';
import { theme } from '../../../theme/docsTheme';

export const sideNavItemBasePadding = css`
  padding-left: ${theme.size.medium};
  padding-right: ${theme.size.medium};
  padding-top: ${theme.size.small};
  padding-bottom: ${theme.size.small};
`;

export const sideNavItemTOCStyling = ({ level = 1, isSelected }) => css`
  padding-bottom: ${theme.size.small};
  padding-left: calc(${theme.size.tiny} + (${level} * ${theme.size.default}));
  padding-right: ${theme.size.medium};
  padding-top: ${theme.size.small};
  align-items: flex-start !important;
  font-size: ${theme.fontSize.small};
  text-transform: none;
  line-height: 20px !important;
  color: var(--font-color-primary);

  // overwrite LG link underlines
  // @leafygreen-ui/typography v13.0.0
  :hover {
    &:after,
    span:after {
      display: none;
    }
  }

  ${isSelected
    ? `
    background-color: var(--green-secondary) !important;
  `
    : `
    :hover {
      background-color: var(--background-tertiary) !important;
    }
  `}
`;

export const sideNavItemFontSize = css`
  font-size: ${theme.fontSize.small};
`;

export const titleStyle = css`
  color: var(--font-color-primary);
  font-size: ${theme.fontSize.small};
  font-weight: bold;
  line-height: 20px;
  text-transform: none;
  :hover {
    background-color: inherit;

    &:after,
    span:after {
      display: none;
    }
  }
`;
