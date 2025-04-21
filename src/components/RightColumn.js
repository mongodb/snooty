import React from 'react';
import PropTypes from 'prop-types';
import { css } from '@emotion/react';
import useStickyTopValues from '../hooks/useStickyTopValues';
import { displayNone } from '../utils/display-none';
import { theme } from '../theme/docsTheme';

export const STYLED_RIGHT_COLUMN = 'styled-right-column';

const RightColumn = ({ children, className }) => {
  const { topLarge } = useStickyTopValues();

  return (
    <div
      className={className}
      css={css`
        margin: 70px ${theme.size.medium} 40px 5px;
        min-width: 180px;
        max-width: 250px;

        ${displayNone.onMobileAndTablet};
      `}
    >
      <div
        css={css`
          height: calc(100vh - 120px);
          overflow: auto;
          position: sticky;
          top: calc(${topLarge} + ${theme.size.medium});

          & > * {
            margin-bottom: 30px;
            margin-right: 24px;
          }
        `}
        id={STYLED_RIGHT_COLUMN}
      >
        {children}
      </div>
    </div>
  );
};

RightColumn.propTypes = {
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]).isRequired,
};

export default RightColumn;
