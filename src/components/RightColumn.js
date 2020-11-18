import React from 'react';
import PropTypes from 'prop-types';
import { css } from '@emotion/core';

const RightColumn = ({ children }) => (
  <div
    css={css`
      flex-grow: 1;
      margin: 70px 15px 40px 65px;
      min-width: 180px;
      order: 2;
    `}
  >
    <div
      css={css`
        position: fixed;
        overflow: auto;
        max-height: calc(100% - 120px);
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
