import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import Step from './Step';
import { theme } from '../../theme/docsTheme';

const StyledProcedure = styled('div')`
  h2 + &,
  h3 + & {
    margin-top: 24px;
  }
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
  // Make the style 'connected' by default for now to give time for PLPs that use this directive to
  // add the "style" option
  const style = options?.style || 'connected';
  const steps = useMemo(() => getSteps(children), [children]);

  return (
    <StyledProcedure procedureStyle={style}>
      {steps.map((child, i) => (
        <Step {...rest} nodeData={child} stepNumber={i + 1} stepStyle={style} key={i} />
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
