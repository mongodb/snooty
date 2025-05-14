import React, { ReactNode } from 'react';
import { css } from '@emotion/react';
import useStickyTopValues from '../hooks/useStickyTopValues';
import { displayNone } from '../utils/display-none';
import { theme } from '../theme/docsTheme';

const RightColumn = ({ children, className }: { children: ReactNode; className?: string }) => {
  const { topLarge } = useStickyTopValues();

  return (
    <div
      className={className}
      // @ts-ignore
      css={css`
        margin: 70px ${theme.size.medium} 40px 5px;
        min-width: 180px;
        max-width: 250px;

        ${displayNone.onMobileAndTablet};
      `}
    >
      <div
        // @ts-ignore
        css={css`
          height: calc(100vh - 120px);
          position: sticky;
          top: calc(${topLarge} + ${theme.size.medium});

          & > * {
            margin-bottom: 30px;
            margin-right: 24px;
          }
        `}
      >
        {children}
      </div>
    </div>
  );
};

export default RightColumn;
