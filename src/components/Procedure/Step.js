import React from 'react';
import PropTypes from 'prop-types';
import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { palette } from '@leafygreen-ui/palette';
import { theme } from '../../theme/docsTheme';
import ComponentFactory from '../ComponentFactory';

const getCircleDynamicStyles = (darkMode, stepStyle) => {
  return {
    connected: {
      backgroundColor: darkMode ? palette.green.dark2 : palette.green.light3,
      color: darkMode ? palette.gray.light2 : palette.green.dark2,
      dimension: '34px',
    },
    normal: {
      backgroundColor: 'inherit',
      color: darkMode ? palette.white : palette.black,
      dimension: '27px',
    },
  }[stepStyle];
};

const circleIndividualStyles = {
  connected: () => css`
    position: relative;
    font-weight: bold;
    z-index: 1;
  `,
  normal: () => css`
    border: 1px solid ${palette.gray.light1};
    font-weight: 400;
    font-size: 16px;
    line-height: 28px;
  `,
};

const Circle = styled('div')`
  align-items: center;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  background-color: ${(props) => props.styleObj.backgroundColor};
  color: ${(props) => props.styleObj.color};
  height: ${(props) => props.styleObj.dimension};
  width: ${(props) => props.styleObj.dimension};
`;

const getStepStyleDynamicStyles = (stepType) => {
  return {
    connected: {
      gap: '33px',
      marginTop: theme.size.tiny,
    },
    normal: {
      gap: theme.size.large,
      marginTop: 'unset',
    },
  }[stepType];
};

const landingStepStyles = {
  connected: (darkMode) => css`
    position: relative;

    :not(:last-child):after {
      content: '';
      border-left: 2px dashed ${darkMode ? palette.gray.dark1 : palette.gray.light2};
      bottom: 0;
      left: 16px;
      position: absolute;
      top: 0;
      z-index: 0;
    }
  `,
  normal: () => {},
};

const StyledStep = styled('div')`
  display: flex;
  gap: ${(props) => props.styleObj.gap};

  h2,
  h3,
  h4 {
    margin-top: ${(props) => props.styleObj.marginTop};
  }
`;

const StepBlock = styled('div')`
  position: relative;
`;

const Content = 'div';

const contentStyles = {
  connected: css`
    padding-bottom: ${theme.size.xlarge};
    @media ${theme.screenSize.upToMedium} {
      padding-bottom: 40px;
    }
    @media ${theme.screenSize.upToSmall} {
      padding-bottom: ${theme.size.large};
    }
  `,
};

const Step = ({ nodeData: { children }, stepNumber, stepStyle = 'normal', darkMode, template, ...rest }) => {
  const useLandingStyles = ['landing', 'product-landing'].includes(template);
  stepStyle = useLandingStyles ? 'connected' : 'normal';

  return (
    <StyledStep styleObj={getStepStyleDynamicStyles(stepStyle)} css={landingStepStyles[stepStyle](darkMode)}>
      <StepBlock>
        <Circle styleObj={getCircleDynamicStyles(darkMode, stepStyle)} css={circleIndividualStyles[stepStyle]}>
          {stepNumber}
        </Circle>
      </StepBlock>
      <Content css={contentStyles[stepStyle]}>
        {children.map((child, i) => (
          <ComponentFactory {...rest} nodeData={child} template={template} key={i} />
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
