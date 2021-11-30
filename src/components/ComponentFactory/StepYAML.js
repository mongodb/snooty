import React from 'react';
import PropTypes from 'prop-types';
import ComponentFactory from './index';

const StepYAML = ({ nodeData: { children }, stepNum, ...rest }) => (
  <div className="sequence-block">
    <div className="bullet-block">
      <div className="sequence-step">{stepNum}</div>
    </div>
    <div className="section">
      {children.map((child, index) => (
        <ComponentFactory {...rest} nodeData={child} key={index} />
      ))}
    </div>
  </div>
);

StepYAML.propTypes = {
  nodeData: PropTypes.shape({
    children: PropTypes.array.isRequired,
  }).isRequired,
  stepNum: PropTypes.number,
};

StepYAML.defaultProps = {
  stepNum: 1,
};

export default StepYAML;
