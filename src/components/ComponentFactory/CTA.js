import React from 'react';
import PropTypes from 'prop-types';
import { css } from '@emotion/core';
import ComponentFactory from './index';

const CTA = ({ nodeData: { children }, ...rest }) => (
  <div
    css={css`
      font-weight: bold;
    `}
  >
    {children.map((child, i) => (
      <ComponentFactory nodeData={child} key={i} {...rest} />
    ))}
  </div>
);

CTA.propTypes = {
  nodeData: PropTypes.shape({
    children: PropTypes.arrayOf(PropTypes.object),
  }).isRequired,
};

export default CTA;
