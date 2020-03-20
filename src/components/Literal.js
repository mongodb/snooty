import React from 'react';
import PropTypes from 'prop-types';
import ComponentFactory from './ComponentFactory';

const Literal = ({ nodeData: { children } }) => (
  <code>
    {children.map((node, i) => (
      <ComponentFactory nodeData={node} key={i} />
    ))}
  </code>
);

Literal.propTypes = {
  nodeData: PropTypes.shape({
    children: PropTypes.arrayOf(PropTypes.object).isRequired,
  }).isRequired,
};

export default Literal;
