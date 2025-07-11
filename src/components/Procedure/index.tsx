import React, { useMemo } from 'react';
import styled from '@emotion/styled';
import { palette } from '@leafygreen-ui/palette';
import {
  AncestorComponentContextProvider,
  useAncestorComponentContext,
} from '../../context/ancestor-components-context';
import { theme } from '../../theme/docsTheme';
import { STRUCTURED_DATA_CLASSNAME, constructHowToSd } from '../../utils/structured-data';
import { useHeadingContext } from '../../context/heading-context';
import { ASTNode, ProcedureNode, ProcedureStyle, StepNode } from '../../types/ast';
import { isDirectiveNode, isParentNode } from '../../types/ast-utils';
import Step from './Step';

const StyledProcedure = styled('div')<{ procedureStyle: ProcedureStyle }>`
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
const getSteps = (children: ASTNode[]) => {
  const steps: StepNode[] = [];

  for (const child of children) {
    if (!isDirectiveNode(child)) {
      continue;
    }

    const { name } = child;

    if (name === 'step') {
      steps.push(child as StepNode);
    } else if (name === 'include') {
      // Content in an include file is wrapped in a root node
      const [includeRoot] = child.children;
      if (isParentNode(includeRoot)) {
        steps.push(...getSteps(includeRoot.children));
      }
    }
  }

  return steps;
};

export type ProcedureProps = {
  nodeData: ProcedureNode;
};

const Procedure = ({ nodeData, ...rest }: ProcedureProps) => {
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

export default Procedure;
