import React from 'react';
import PropTypes from 'prop-types';
import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { palette } from '@leafygreen-ui/palette';
import { theme } from '../../theme/docsTheme';
import ComponentFactory from '../ComponentFactory';

const circleIndividualStyles = {
  connected: (darkMode) => css`
    position: relative;
    font-weight: bold;
    background-color: ${darkMode ? palette.green.dark2 : palette.green.light3};
    color: ${darkMode ? palette.gray.light2 : palette.green.dark2};
    height: 34px;
    width: 34px;
  `,
  normal: (darkMode) => css`
    border: 1.5px solid ${palette.gray.light1};
    font-weight: 400;
    font-size: 16px;
    line-height: 28px;
    background-color: inherit;
    color: ${darkMode ? palette.white : palette.black};
    height: 27px;
    width: 27px;
  `,
};

const Circle = styled('div')`
  align-items: center;
  border-radius: 50%;
  display: flex;
  justify-content: center;
`;

const landingStepStyles = {
  connected: (darkMode) => css`
    position: relative;
    gap: 33px;

    h2,
    h3,
    h4 {
      margin-top: ${theme.size.tiny};
    }

    :not(:last-child):before {
      content: '';
      border-left: 2px dashed ${darkMode ? palette.gray.dark1 : palette.gray.light2};
      bottom: 0;
      left: 16px;
      position: absolute;
      top: 0;
    }
  `,
  normal: (darkMode) => css`
    gap: ${theme.size.default};
    h2,
    h4,
    h6 {
      margin-top: unset;
    }
    h3 {
      margin-top: 2px;
    }
  `,
};

const StyledStep = styled('div')`
  display: flex;
`;

const StepBlock = styled('div')`
  position: relative;

  // 27 for circle height + 32px minimum spacing between circles
  min-height: 59px;
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
  normal: css`
    section > *,
    ol p,
    ul p {
      margin-bottom: ${theme.size.default};
    }
  `,
};

const Step = ({ nodeData: { children }, stepNumber, stepStyle = 'connected', darkMode, template, ...rest }) => {
  return (
    <StyledStep css={landingStepStyles[stepStyle](darkMode)}>
      <StepBlock>
        <Circle css={circleIndividualStyles[stepStyle](darkMode)}>{stepNumber}</Circle>
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
