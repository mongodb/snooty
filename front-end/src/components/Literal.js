import React from 'react';
import PropTypes from 'prop-types';

const Literal = ({ nodeData }) => (
  <code className="docutils literal notranslate">
    <span className="pre">{nodeData.children[0].value}</span>
  </code>
);

Literal.propTypes = {
  nodeData: PropTypes.shape({
    children: PropTypes.arrayOf(
      PropTypes.shape({
        value: PropTypes.string.isRequired,
      })
    ).isRequired,
  }).isRequired,
};

export default Literal;
