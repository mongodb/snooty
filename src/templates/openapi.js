import React from 'react';
import PropTypes from 'prop-types';
import { css } from '@emotion/core';
import { TEMPLATE_CLASSNAME } from '../constants';

const OpenAPITemplate = ({ children, className }) => (
  <div
    className={`${TEMPLATE_CLASSNAME} ${className}`}
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
  className: PropTypes.string,
};

export default OpenAPITemplate;
