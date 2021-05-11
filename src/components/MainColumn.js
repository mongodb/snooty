import React from 'react';
import PropTypes from 'prop-types';
import { css } from '@emotion/core';
import { theme } from '../theme/docsTheme';

const MainColumn = ({ children, className }) => (
  <main
    className={className}
    css={css`
      margin: ${theme.size.xlarge};
      max-width: 800px;
      min-height: 600px;
    `}
  >
    {children}
  </main>
);

MainColumn.propTypes = {
  className: PropTypes.string,
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]).isRequired,
};

export default MainColumn;
