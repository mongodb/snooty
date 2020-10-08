import React from 'react';
import PropTypes from 'prop-types';
import { css } from '@emotion/core';

const RightColumn = ({ children }) => (
  <div
    css={css`
      flex-grow: 1;
      margin: 40px 15px;
      min-width: 180px;
      order: 2;
    `}
  >
    {children}
  </div>
);

RightColumn.propTypes = {
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]).isRequired,
};

export default RightColumn;
