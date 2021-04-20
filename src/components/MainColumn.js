import React from 'react';
import PropTypes from 'prop-types';
import { css } from '@emotion/core';

const MainColumn = ({ children, className }) => (
  <main
    className={className}
    css={css`
      margin: 40px 15px;
      max-width: 800px;
      min-height: 600px;
    `}
  >
    {children}
  </main>
);

MainColumn.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node,
};

export default MainColumn;
