import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import { uiColors } from '@leafygreen-ui/palette';
import ComponentFactory from '../ComponentFactory';

const Circle = styled('div')`
  background: ${uiColors.green.light3};
  width: 34px;
  height: 34px;
  border-radius: 50%;
  margin-bottom: -29px;
  margin-left: -67px;
  text-align: center;
`;

const StepNumber = styled('div')`
  font-weight: bold;
  font-size: 16px;
  color: ${uiColors.green.dark2};
  margin: auto;
  padding-top: 6px;
`;

const LandingStep = styled('div')`
  padding-left: 50px;
  padding-bottom: 20px;
  &:not(&:last-child) {
    border-left: dashed;
    border-color: ${uiColors.gray.light2};
    border-width: 2px;
    padding-bottom: 50px;
  }
  & > p > a {
    font-weight: 600;
  }
`;

const Step = ({ nodeData: { children, argument }, stepNumber, ...rest }) => {
  return (
    <LandingStep>
      <Circle>
        <StepNumber>{stepNumber}</StepNumber>
      </Circle>
      <h2>
        {argument.map((child, i) => (
          <ComponentFactory {...rest} nodeData={child} key={i} />
        ))}
      </h2>
      {children.map((child, i) => (
        <ComponentFactory {...rest} nodeData={child} key={i} />
      ))}
    </LandingStep>
  );
};

Step.propTypes = {
  nodeData: PropTypes.shape({
    argument: PropTypes.arrayOf(PropTypes.object).isRequired,
    children: PropTypes.arrayOf(PropTypes.object).isRequired,
  }).isRequired,
};

export default Step;
