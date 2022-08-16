import { css } from '@leafygreen-ui/emotion';
import { uiColors } from '@leafygreen-ui/palette';
import { theme } from '../../../theme/docsTheme';

export const sideNavItemBasePadding = css`
  padding-left: ${theme.size.medium};
  padding-right: ${theme.size.medium};
  padding-top: ${theme.size.small};
  padding-bottom: ${theme.size.small};
`;

export const sideNavItemTOCStyling = ({ level = 1 }) => css`
  color: ${uiColors.gray.dark3};
  padding-bottom: ${theme.size.small};
  padding-left: calc(${theme.size.tiny} + (${level} * ${theme.size.default}));
  padding-right: ${theme.size.medium};
  padding-top: ${theme.size.small};
  text-transform: none;
  align-items: flex-start;
  font-size: ${theme.fontSize.small};
  line-height: 20px;
`;
