import React from 'react';
import PropTypes from 'prop-types';
import ComponentFactory from '../ComponentFactory';

const Line = ({ nodeData: { children }, ...rest }) => {
  if (children.length !== 0) {
    return (
      <div className="line">
        {children.map((child, index) => (
          <ComponentFactory key={index} {...rest} nodeData={child} />
        ))}
      </div>
    );
  }
  return (
    <div className="line">
      <br />
    </div>
  );
};

Line.propTypes = {
  nodeData: PropTypes.shape({
    children: PropTypes.arrayOf(PropTypes.object).isRequired,
  }).isRequired,
};
export default Line;
