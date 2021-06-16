import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import { uiColors } from '@leafygreen-ui/palette';
import { theme } from '../theme/docsTheme';
import ComponentFactory from './ComponentFactory';

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
  &:not(&:last-child) {
    border-left: dashed;
    border-color: ${uiColors.gray.light2};
    border-width: 2px;
    padding-bottom: ${theme.size.xlarge};
    @media ${theme.screenSize.upToMedium} {
      padding-bottom: 40px;
    }
    @media ${theme.screenSize.upToSmall} {
      padding-bottom: ${theme.size.large};
    }
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
