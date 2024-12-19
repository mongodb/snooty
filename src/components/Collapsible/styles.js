import { css } from '@leafygreen-ui/emotion';
import { palette } from '@leafygreen-ui/palette';
import { theme } from '../../theme/docsTheme';
import { CLASSNAME as OFFLINE_CLASSNAME } from '../../utils/head-scripts/offline-ui/collapsible';

export const collapsibleStyle = css`
  border-bottom: 1px solid ${palette.gray.light2};

  &:nth-child(1 of .collapsible) {
    border-top: 1px solid ${palette.gray.light2};
    margin-top: ${theme.size.large};
  }

  &:nth-last-child(1 of .collapsible) {
    margin-bottom: ${theme.size.large};
  }
`;

export const headerContainerStyle = css`
  display: flex;
  justify-content: space-between;
  column-gap: ${theme.size.medium};
  margin: ${theme.size.large} 0;
`;

export const headerStyle = css`
  margin-top: 0;
`;

export const iconStyle = css`
  align-self: center;
  flex-shrink: 0;

  .${OFFLINE_CLASSNAME}[aria-expanded=false] & {
    transform: rotate(-90deg);
  }
`;

export const innerContentStyle = css`
  overflow: hidden;
  height: 0;
  color: --font-color-primary;

  [aria-expanded='true'] & {
    height: auto;
  }
`;
