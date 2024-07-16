import React, { useMemo, useContext } from 'react';
import { css, cx } from '@leafygreen-ui/emotion';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import { palette } from '@leafygreen-ui/palette';
import { useDarkMode } from '@leafygreen-ui/leafygreen-provider';
import { theme } from '../../theme/docsTheme';
import { PageContext } from '../../context/page-context';
import Step from './Step';

const THEME_STYLES = {
  light: {
    backgroundColor: 'initial',
    color: 'initial',
  },
  dark: {
    backgroundColor: palette.black,
    color: palette.gray.light2,
  },
};

const procedureStyles = (themeObj) => css`
  background-color: ${themeObj.backgroundColor};
  color: ${themeObj.color};
`;

const StyledProcedure = styled('div')`
  margin-top: ${theme.size.default};
  ${({ procedureStyle }) =>
    procedureStyle === 'connected' &&
    `
    @media ${theme.screenSize.upToLarge} {
      padding-bottom: ${theme.size.large};
    }
    @media ${theme.screenSize.upToSmall} {
      padding-bottom: ${theme.size.medium};
    }
  `}
`;

// Returns an array of all "step" nodes nested within the "procedure" node and nested "include" nodes
const getSteps = (children) => {
  const steps = [];

  for (const child of children) {
    const { name, type } = child;

    if (type !== 'directive') {
      continue;
    }

    if (name === 'step') {
      steps.push(child);
    } else if (name === 'include') {
      // Content in an include file is wrapped in a root node
      const [includeRoot] = child.children;
      steps.push(...getSteps(includeRoot.children));
    }
  }

  return steps;
};

const Procedure = ({ nodeData: { children, options }, ...rest }) => {
  // Procedures will be 'connected' (or whatever is provided) on Landing pages or product landing
  // pages, and not connected on others

  const { template } = useContext(PageContext);

  const useLandingStyles = ['landing', 'product-landing'].includes(template);
  const style = useLandingStyles ? options?.style || 'connected' : 'normal';
  const steps = useMemo(() => getSteps(children), [children]);

  const { darkMode, theme: siteTheme } = useDarkMode();

  return (
    <StyledProcedure procedureStyle={style} className={cx(procedureStyles(THEME_STYLES[siteTheme]))}>
      {steps.map((child, i) => (
        <Step
          {...rest}
          nodeData={child}
          stepNumber={i + 1}
          stepStyle={style}
          template={template}
          key={i}
          darkMode={darkMode}
        />
      ))}
    </StyledProcedure>
  );
};

Procedure.propTypes = {
  nodeData: PropTypes.shape({
    children: PropTypes.arrayOf(PropTypes.object).isRequired,
  }).isRequired,
};

export default Procedure;
