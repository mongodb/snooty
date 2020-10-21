import React from 'react';
import PropTypes from 'prop-types';
import ComponentFactory from './ComponentFactory';

const Step = ({ nodeData: { children }, stepNum, ...rest }) => (
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

Step.propTypes = {
  nodeData: PropTypes.shape({
    children: PropTypes.array.isRequired,
  }).isRequired,
  stepNum: PropTypes.number,
};

Step.defaultProps = {
  stepNum: 1,
};

export default Step;
