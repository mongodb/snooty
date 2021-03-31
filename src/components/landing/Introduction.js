import React from 'react';
import PropTypes from 'prop-types';
import ComponentFactory from '../ComponentFactory';

const Introduction = ({ nodeData: { children }, ...rest }) => (
  <div className="introduction">
    {children.map((child, i) => (
      <ComponentFactory nodeData={child} key={i} {...rest} />
    ))}
  </div>
);

Introduction.propTypes = {
  nodeData: PropTypes.shape({
    children: PropTypes.arrayOf(PropTypes.object),
  }).isRequired,
};

export default Introduction;
