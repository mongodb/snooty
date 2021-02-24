import React from 'react';
import PropTypes from 'prop-types';
import { css } from '@emotion/core';

const MainColumn = ({ className, children }) => (
  <div
    className={className}
    css={css`
      align-items: center;
      display: inline-block;
      flex-grow: 2;
      justify-content: center;
      margin: 40px 15px;
      max-width: 800px;
      min-height: 600px;
      order: 1;
      overflow-x: scroll;
      transition: margin-left 0.4s cubic-bezier(0.02, 0.01, 0.47, 1);
      width: 68%;
      -ms-flex-align: center;
      -ms-flex-order: 1;
      -ms-flex-pack: center;
      -ms-flex-positive: 2;
    `}
  >
    {children}
  </div>
);

MainColumn.propTypes = {
  className: PropTypes.string,
  children: PropTypes.array,
};

export default MainColumn;
