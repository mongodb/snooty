import React, { ReactNode } from 'react';
import { cx, css } from '@leafygreen-ui/emotion';
import { theme } from '../theme/docsTheme';

export const MAIN_COLUMN_HORIZONTAL_MARGIN = theme.size.xlarge;

const MainColumn = ({ children, className }: { children: ReactNode; className?: string }) => (
  <main
    className={cx(
      css`
        margin: ${theme.size.default} ${MAIN_COLUMN_HORIZONTAL_MARGIN} ${theme.size.xlarge};
        max-width: 800px;
        min-height: 600px;

        @media ${theme.screenSize.upToLarge} {
          margin: ${theme.size.default} 48px ${theme.size.xlarge};
        }

        @media ${theme.screenSize.upToSmall} {
          margin: ${theme.size.default} ${theme.size.medium} ${theme.size.xlarge};
        }
      `,
      className
    )}
  >
    {children}
  </main>
);

export default MainColumn;
