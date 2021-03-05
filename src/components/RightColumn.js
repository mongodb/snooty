import React from 'react';
import PropTypes from 'prop-types';
import { css } from '@emotion/core';
import { displayNone } from '../utils/display-none';

const RightColumn = ({ children, className }) => (
  <div
    className={className}
    css={css`
      margin: 70px 24px 40px 54px;
      min-width: 180px;

      ${displayNone.onMobileAndTablet};
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
