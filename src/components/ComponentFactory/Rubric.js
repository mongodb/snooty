import React from 'react';
import PropTypes from 'prop-types';
import ComponentFactory from './index';

const Rubric = ({ nodeData: { argument }, ...rest }) => (
  <p className="rubric">
    {argument.map((node, i) => (
      <ComponentFactory {...rest} key={i} nodeData={node} />
    ))}
  </p>
);

Rubric.propTypes = {
  nodeData: PropTypes.shape({
    argument: PropTypes.arrayOf(PropTypes.object).isRequired,
  }).isRequired,
};

export default Rubric;
