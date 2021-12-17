import React from 'react';
import PropTypes from 'prop-types';
import { css } from '@emotion/core';
import styled from '@emotion/styled';
import { uiColors } from '@leafygreen-ui/palette';
import { theme } from '../theme/docsTheme';
import ComponentFactory from './ComponentFactory';

const Circle = styled('div')`
  align-items: center;
  border-radius: 50%;
  display: flex;
  font-weight: bold;
  justify-content: center;
`;

const LandingStep = styled('div')`
  display: flex;
`;

const StepBlock = styled('div')`
  position: relative;
`;

const Content = styled.div`
  // Remove the top margin of immediate child (especially for headings)
  & > * {
    margin-top: 0;
  }
`;

const stepBlockStyles = {
  connected: css`
    :after {
      content: '';
      border-left: 2px dashed ${uiColors.gray.light2};
      bottom: 0;
      left: calc(50% - 1px);
      position: absolute;
      top: 0;
      z-index: -1;
    }
  `,
  normal: null,
};

const circleStyles = {
  connected: css`
    background-color: ${uiColors.green.light3};
    color: ${uiColors.green.dark2};
    height: 34px;
    width: 34px;
  `,
  normal: css`
    background-color: #333;
    color: ${uiColors.white};
    height: ${theme.size.medium};
    width: ${theme.size.medium};
  `,
};

const landingStepStyles = {
  connected: css`
    gap: 33px;
  `,
  normal: css`
    gap: ${theme.size.default};
  `,
};

const contentStyles = {
  connected: css`
    margin-top: 5px;
    padding-bottom: ${theme.size.xlarge};

    @media ${theme.screenSize.upToMedium} {
      padding-bottom: 40px;
    }

    @media ${theme.screenSize.upToSmall} {
      padding-bottom: ${theme.size.large};
    }
  `,
  normal: null,
};

const Step = ({ nodeData: { children, argument }, isLastStep, sectionDepth, stepNumber, style, ...rest }) => {
  // PLP's connected style expects H2 headings
  const headingSize = style === 'connected' ? 2 : sectionDepth + 1;

  return (
    <LandingStep css={landingStepStyles[style]}>
      <StepBlock css={!isLastStep && stepBlockStyles[style]}>
        <Circle css={circleStyles[style]}>{stepNumber}</Circle>
      </StepBlock>
      <Content css={contentStyles[style]}>
        {argument.map((child, i) => (
          <ComponentFactory {...rest} nodeData={child} sectionDepth={headingSize} key={i} />
        ))}
        {children.map((child, i) => (
          <ComponentFactory {...rest} nodeData={child} sectionDepth={sectionDepth} key={i} />
        ))}
      </Content>
    </LandingStep>
  );
};

Step.propTypes = {
  nodeData: PropTypes.shape({
    argument: PropTypes.arrayOf(PropTypes.object).isRequired,
    children: PropTypes.arrayOf(PropTypes.object).isRequired,
  }).isRequired,
  isLastStep: PropTypes.bool,
  sectionDepth: PropTypes.number.isRequired,
  stepNumber: PropTypes.number.isRequired,
  style: PropTypes.string.isRequired,
};

export default Step;
