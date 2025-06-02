import React, { ReactNode } from 'react';
import { cx, css } from '@leafygreen-ui/emotion';
import useStickyTopValues from '../hooks/useStickyTopValues';
import { displayNone } from '../utils/display-none';
import { theme } from '../theme/docsTheme';
import { DISMISSIBLE_SKILLS_CARD_CLASSNAME } from './DismissibleSkillsCard';

const RightColumn = ({
  hasDismissibleSkillsCard,
  children,
}: {
  hasDismissibleSkillsCard: boolean;
  children: ReactNode;
}) => {
  const { topLarge } = useStickyTopValues();

  return (
    <div
      className={cx(css`
        margin: 50px ${theme.size.medium} 70px 5px;
        min-width: ${hasDismissibleSkillsCard ? '250px' : '180px'};
        max-width: 250px;
        z-index: ${theme.zIndexes.content + 2};

        ${displayNone.onMobileAndTablet};
      `)}
    >
      <div
        // @ts-ignore
        className={cx(css`
          height: calc(100vh - 120px);
          position: sticky;
          top: calc(${topLarge} + ${theme.size.medium});

          & > *:not(.${DISMISSIBLE_SKILLS_CARD_CLASSNAME}) {
            margin-bottom: 30px;
            ${!hasDismissibleSkillsCard ? 'margin-right: 24px;' : ''}
          }
        `)}
      >
        {children}
      </div>
    </div>
  );
};

export default RightColumn;
