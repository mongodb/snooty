import { css } from '@emotion/react';
import { uiColors } from '@leafygreen-ui/palette';
import { theme } from '../../../theme/docsTheme';

export const baseCodeStyle = css`
  display: table;
  margin: ${theme.size.default} 0;
  min-width: 150px;
  table-layout: fixed;
  width: 100%;

  // Inner div of LG component has a width set to 700px. Unset this as part of our
  // override for docs when the language switcher is being used.
  > div > div {
    width: unset;

    // TODO: (DOP-2576) Remove this when we upgrade LG Code component.
    // Keep this within the context of the language switcher
    button > div {
      grid-template-columns: 16px 1fr 16px;
    }
  }

  // Override default LG Code language switcher font size
  button > div > div {
    font-size: ${theme.fontSize.default};
  }
`;

export const borderCodeStyle = css`
  border: 1px solid ${uiColors.gray.light2};
`;
