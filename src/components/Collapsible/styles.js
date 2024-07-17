import { css } from '@leafygreen-ui/emotion';
import { palette } from '@leafygreen-ui/palette';
import { theme } from '../../theme/docsTheme';

export const collapsibleStyle = css`
  margin-top: ${theme.size.large};
  border-top: 1px solid ${palette.gray.light2};
  border-bottom: 1px solid ${palette.gray.light2};
  @media ${theme.screenSize['2XLargeAndUp']} {
    // min-width: 775px;
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

export const iconStyle = (darkMode) => css`
  align-self: center;
  cursor: pointer;
  flex-shrink: 0;
  ${!darkMode && `color: ${palette.gray.dark1}`}
`;

export const innerContentStyle = (open) => css`
  transition: 0.3s linear;
  overflow: hidden;
  height: 0;
  ${open && `height: auto;`}
`;
