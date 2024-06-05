import React from 'react';
import PropTypes from 'prop-types';
import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { palette } from '@leafygreen-ui/palette';
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
`;

const StepBlock = styled('div')`
  position: relative;
`;

const Content = 'div';

const circleStyles = {
  connected: () => css`
    position: relative;
    background-color: var(--background-color);
    color: var(--color);
    height: 34px;
    width: 34px;
    z-index: var(--z-index);
  `,
  normal: () => css`
    background-color: var(--background-color);
    color: var(--color);
    height: ${theme.size.medium};
    width: ${theme.size.medium};
  `,
};

const landingStepStyles = {
  connected: () => css`
    position: relative;
    gap: 33px;

    :not(:last-child):after {
      content: '';
      border-left: 2px dashed var(--border-left);
      bottom: 0;
      left: 16px;
      position: absolute;
      top: 0;
      z-index: var(--z-index);
    }

    h2,
    h3,
    h4 {
      margin-top: ${theme.size.tiny};
    }
  `,
  normal: () => css`
    gap: ${theme.size.default};

    h2,
    h3,
    h4 {
      margin-top: unset;
    }
  `,
};

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

const getStepStyleDynamicStyles = (darkMode, stepType) => {
  return {
    connected: {
      '--border-left': darkMode ? palette.gray.dark1 : palette.gray.light2,
      '--z-index': darkMode ? '0' : ' -1',
    },
    normal: {},
  }[stepType];
};

const getCircleDynamicStyles = (darkMode, stepStyle) => {
  return {
    connected: {
      '--background-color': darkMode ? palette.green.dark2 : palette.green.light3,
      '--color': darkMode ? palette.gray.light2 : palette.green.dark2,
      '--z-index': darkMode ? '1' : '0',
    },
    normal: {
      '--background-color': darkMode ? palette.gray.dark2 : palette.black,
      '--color': darkMode ? palette.gray.light2 : palette.white,
    },
  }[stepStyle];
};

const Step = ({ nodeData: { children }, stepNumber, stepStyle = 'connected', darkMode, ...rest }) => {
  return (
    <StyledStep css={landingStepStyles[stepStyle]} style={getStepStyleDynamicStyles(darkMode, stepStyle)}>
      <StepBlock>
        <Circle css={circleStyles[stepStyle]} style={getCircleDynamicStyles(darkMode, stepStyle)}>
          {stepNumber}
        </Circle>
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
