import React from 'react';
import PropTypes from 'prop-types';
import { InlineKeyCode } from '@leafygreen-ui/typography';
import ComponentFactory from '../ComponentFactory';

const Kbd = ({ nodeData: { children } }) => (
  <InlineKeyCode>
    {children.map((node, i) => (
      <ComponentFactory key={i} nodeData={node} />
    ))}
  </InlineKeyCode>
);

Kbd.propTypes = {
  nodeData: PropTypes.shape({
    children: PropTypes.arrayOf(PropTypes.object).isRequired,
  }).isRequired,
};

export default Kbd;
