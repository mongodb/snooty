import React from 'react';
import PropTypes from 'prop-types';
import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { uiColors } from '@leafygreen-ui/palette';
import { theme } from '../../theme/docsTheme';
import ComponentFactory from '../ComponentFactory';

const Circle = styled('div')`
  align-items: center;
  border-radius: 50%;
  display: flex;
  font-weight: bold;
  justify-content: center;
`;

const StyledStep = styled('div')`
  display: flex;

  //   section > p > a {
  //     font-weight: 600;
  //   }
`;

const StepBlock = styled('div')`
  position: relative;
`;

const Content = styled.div`
  // Remove the top margin of nested heading
  & > section > :first-of-type {
    margin-top: 0;
  }
`;

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
    position: relative;
    gap: 33px;

    :not(:last-child):after {
      content: '';
      border-left: 2px dashed ${uiColors.gray.light2};
      bottom: 0;
      left: 16px;
      position: absolute;
      top: 0;
      z-index: -1;
    }
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
  normal: css`
    margin-bottom: ${theme.size.medium};
  `,
};

const Step = ({ nodeData: { children }, stepNumber, stepStyle = 'connected', ...rest }) => {
  return (
    <StyledStep css={landingStepStyles[stepStyle]}>
      <StepBlock>
        <Circle css={circleStyles[stepStyle]}>{stepNumber}</Circle>
      </StepBlock>
      <Content css={contentStyles[stepStyle]}>
        {children.map((child, i) => (
          <ComponentFactory {...rest} nodeData={child} key={i} />
        ))}
      </Content>
    </StyledStep>
  );
};

Step.propTypes = {
  nodeData: PropTypes.shape({
    argument: PropTypes.arrayOf(PropTypes.object).isRequired,
    children: PropTypes.arrayOf(PropTypes.object).isRequired,
  }).isRequired,
  stepNumber: PropTypes.number.isRequired,
  stepStyle: PropTypes.string,
};

export default Step;
