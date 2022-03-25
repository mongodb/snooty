/** @jsx jsx */
import { jsx } from '@emotion/react';
import React from 'react';
import PropTypes from 'prop-types';
import { css } from '@emotion/react';
import { uiColors } from '@leafygreen-ui/palette';
import ComponentFactory from '../ComponentFactory';

const Red = ({ nodeData: { children } }) => (
  <strong
    css={css`
      color: ${uiColors.red.dark2};
    `}
  >
    {children.map((node, i) => (
      <ComponentFactory key={i} nodeData={node} />
    ))}
  </strong>
);

Red.propTypes = {
  nodeData: PropTypes.shape({
    children: PropTypes.arrayOf(PropTypes.object).isRequired,
  }).isRequired,
};

export default Red;
