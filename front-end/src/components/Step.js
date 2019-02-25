import React from 'react';
import PropTypes from 'prop-types';
import ComponentFactory from './ComponentFactory';

const Step = props => {
  const { nodeData, showAllSteps, showStepIndex, stepNum } = props;
  return (
    <div
      className="sequence-block"
      style={{
        display: !(showAllSteps || showStepIndex === stepNum) && 'none',
      }}
    >
      <div className="bullet-block" style={{ display: !showAllSteps && 'none' }}>
        <div className="sequence-step">{stepNum + 1}</div>
      </div>
      <div className="section" id="SOMETHING-HERE">
        {nodeData.children.map((child, index) => (
          <ComponentFactory {...props} nodeData={child} key={index} />
        ))}
      </div>
    </div>
  );
};

Step.propTypes = {
  nodeData: PropTypes.shape({
    children: PropTypes.array.isRequired,
  }).isRequired,
  showAllSteps: PropTypes.bool,
  showStepIndex: PropTypes.number,
  stepNum: PropTypes.number,
};

export default Step;
