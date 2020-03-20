import React from 'react';
import PropTypes from 'prop-types';
import ComponentFactory from './ComponentFactory';

const Literal = ({ nodeData: { children }, ...rest }) => {
  return (
    <code className="docutils literal notranslate">
      {children.map((child, index) => (
        <ComponentFactory key={index} {...rest} nodeData={child} />
      ))}
    </code>
  );
};

Literal.propTypes = {
  nodeData: PropTypes.shape({
    children: PropTypes.arrayOf(PropTypes.object).isRequired,
  }).isRequired,
};

export default Literal;
