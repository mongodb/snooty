import React from 'react';
import PropTypes from 'prop-types';
import ComponentFactory from '../ComponentFactory';
import { Subtitle } from '@leafygreen-ui/typography';

const Step = ({ nodeData: { children, argument }, stepNumber, ...rest }) => {
  return (
    <div className="landing-step">
      <div class="circle">
        <div class="step-number">{stepNumber}</div>
      </div>
      <Subtitle>
        {argument.map((child, i) => (
          <ComponentFactory {...rest} nodeData={child} key={i} />
        ))}
      </Subtitle>
      {children.map((child, i) => (
        <ComponentFactory {...rest} nodeData={child} key={i} />
      ))}
    </div>
  );
};

Step.propTypes = {
  nodeData: PropTypes.shape({
    argument: PropTypes.arrayOf(PropTypes.object).isRequired,
    children: PropTypes.arrayOf(PropTypes.object).isRequired,
  }).isRequired,
};

export default Step;
