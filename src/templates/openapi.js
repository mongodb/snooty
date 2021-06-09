import React from 'react';
import PropTypes from 'prop-types';
import { css } from '@emotion/core';

const OpenAPITemplate = ({ children }) => (
  <div
    css={css`
      // Prevent loading animation from being side by side with footer when using flex
      display: block;
    `}
  >
    {children}
  </div>
);

OpenAPITemplate.propTypes = {
  children: PropTypes.arrayOf(PropTypes.node),
};

export default OpenAPITemplate;
