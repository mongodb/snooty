import React from 'react';
import PropTypes from 'prop-types';
import ComponentFactory from './ComponentFactory';
import { findKeyValuePair, slugifyTitle } from '../util';

const Step = props => {
  const { nodeData, showAllSteps, showStepIndex, stepNum } = props;
  const getHeadingText = (node, stringArr) => {
    if (node.value) {
      stringArr.push(node.value);
    } else if (node.children) {
      node.children.forEach(child => {
        stringArr = getHeadingText(child, stringArr); // eslint-disable-line no-param-reassign
      });
    }
    return stringArr;
  };

  const headingNode = findKeyValuePair(nodeData.children, 'type', 'heading');
  const headingId = slugifyTitle(getHeadingText(headingNode, []).join(''));

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
      <div className="section" id={headingId}>
        {nodeData.children.map((child, index) => (
          <ComponentFactory {...props} nodeData={child} key={index} id={headingId} />
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

Step.defaultProps = {
  showAllSteps: true,
  showStepIndex: 0,
  stepNum: 0,
};

export default Step;
