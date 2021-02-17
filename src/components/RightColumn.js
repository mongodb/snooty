import React from 'react';
import PropTypes from 'prop-types';
import { css } from '@emotion/core';
import { theme } from '../theme/docsTheme';

const RightColumn = ({ children }) => (
  <div
    css={css`
      flex-grow: 1;
      margin: 70px 24px 40px 54px;
      min-width: 180px;
      order: 2;

      @media ${theme.screenSize.upToLarge} {
        display: none;
      }
    `}
  >
    <div
      css={css`
        position: fixed;
        overflow: auto;
        max-height: calc(100% - 120px);

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

RightColumn.propTypes = {
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]).isRequired,
};

export default RightColumn;
