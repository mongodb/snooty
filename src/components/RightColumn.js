import React from 'react';
import PropTypes from 'prop-types';
import { css } from '@emotion/core';
import { displayNone } from '../utils/display-none';

const RightColumn = ({ children }) => (
  <div
    css={css`
      flex-grow: 1;
      margin: 70px 24px 40px 54px;
      min-width: 180px;
      order: 2;

      ${displayNone.onMobileAndTablet};
    `}
  >
    <div
      css={css`
        height: 100%;
        max-height: calc(100vh - 120px);
        overflow: auto;
        position: fixed;

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
