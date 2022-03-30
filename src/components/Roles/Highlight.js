import React from 'react';
import PropTypes from 'prop-types';
import { css } from '@emotion/react';
import { uiColors } from '@leafygreen-ui/palette';
import ComponentFactory from '../ComponentFactory';

const colorMap = {
  'highlight-blue': uiColors.blue.light3,
  'highlight-green': uiColors.green.light3,
  'highlight-red': uiColors.red.light3,
  'highlight-yellow': uiColors.yellow.light3,
};

const Highlight = ({ nodeData: { children, name } }) => (
  <span
    css={css`
      background-color: ${colorMap[name]};
    `}
  >
    {children.map((node, i) => (
      <ComponentFactory key={i} nodeData={node} />
    ))}
  </span>
);

Highlight.propTypes = {
  nodeData: PropTypes.shape({
    children: PropTypes.arrayOf(PropTypes.object).isRequired,
    name: PropTypes.string.isRequired,
  }).isRequired,
};

export default Highlight;
