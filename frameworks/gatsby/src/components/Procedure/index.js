import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import { palette } from '@leafygreen-ui/palette';
import {
  AncestorComponentContextProvider,
  useAncestorComponentContext,
} from '../../context/ancestor-components-context';
import { theme } from '../../theme/docsTheme';
import { STRUCTURED_DATA_CLASSNAME, constructHowToSd } from '../../utils/structured-data';
import { useHeadingContext } from '../../context/heading-context';
import Step from './Step';

const StyledProcedure = styled('div')`
  margin-top: ${theme.size.default};

  .dark-theme & {
    color: ${palette.gray.light2};
    background-color: ${palette.black};
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

const Procedure = ({ nodeData, ...rest }) => {
  // Make the style 'connected' by default for now to give time for PLPs that use this directive to
  // add the "style" option
  const children = nodeData['children'];
  const options = nodeData['options'];
  const style = options?.style || 'connected';
  const steps = useMemo(() => getSteps(children), [children]);
  const ancestors = useAncestorComponentContext();
  const { lastHeading } = useHeadingContext();

  // construct Structured Data
  const howToSd = useMemo(() => {
    if (ancestors['procedure']) return undefined;

    const howToSd = constructHowToSd({ steps, parentHeading: options?.title ?? lastHeading });
    return howToSd.isValid() ? howToSd.toString() : undefined;
  }, [ancestors, lastHeading, steps, options]);

  return (
    <AncestorComponentContextProvider component={'procedure'}>
      {howToSd && (
        // using dangerouslySetInnerHTML as JSON is rendered with
        // encoded quotes at build time
        <script
          className={STRUCTURED_DATA_CLASSNAME}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: howToSd }}
        />
      )}
      <StyledProcedure procedureStyle={style}>
        {steps.map((child, i) => (
          <Step {...rest} nodeData={child} stepNumber={i + 1} stepStyle={style} key={i} />
        ))}
      </StyledProcedure>
    </AncestorComponentContextProvider>
  );
};

Procedure.propTypes = {
  nodeData: PropTypes.shape({
    children: PropTypes.arrayOf(PropTypes.object).isRequired,
  }).isRequired,
};

export default Procedure;
