import React from 'react';
import PropTypes from 'prop-types';
import ComponentFactory from '../ComponentFactory';

const LineBlock = ({ nodeData: { children }, ...rest }) => (
  <div className="line-block">
    {children.map((child, index) => (
      <ComponentFactory key={index} {...rest} nodeData={child} />
    ))}
  </div>
);

LineBlock.propTypes = {
  nodeData: PropTypes.shape({
    children: PropTypes.arrayOf(PropTypes.object).isRequired,
  }).isRequired,
};

export default LineBlock;
