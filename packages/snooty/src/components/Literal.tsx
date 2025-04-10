import React from 'react';
import styled from '@emotion/styled';
import { css, cx } from '@leafygreen-ui/emotion';
import { InlineCode } from '@leafygreen-ui/typography';
import { LiteralNode } from '../types/ast';
import ComponentFactory from './ComponentFactory';

const inlineCodeStyling = css`
  /* Unset font size so it inherits it from its context */
  font-size: unset;
  display: inline;
  color: var(--font-color-primary);
  background: var(--background-color-secondary);

  a & {
    color: inherit;
  }
`;

const wordWrapStyle = css`
  word-wrap: break-word;
  white-space: unset;
`;

const StyledNavigationInlineCode = styled('code')`
  /* Used for Literals that don't need LeafyGreen's InlineCode component */
  font-family: 'Source Code Pro';
  color: unset;
`;

export type FormatTextOptions = {
  literalEnableInline: boolean;
};

export type LiteralProps = {
  nodeData: LiteralNode;
  formatTextOptions?: FormatTextOptions;
};

const Literal = ({ nodeData: { children }, formatTextOptions }: LiteralProps) => {
  const navigationStyle = formatTextOptions?.literalEnableInline;
  const CurrInlineCode = navigationStyle ? StyledNavigationInlineCode : InlineCode;

  return (
    <CurrInlineCode className={cx(navigationStyle ? '' : inlineCodeStyling, wordWrapStyle)}>
      {children.map((node, i) => (
        <ComponentFactory nodeData={node} key={i} />
      ))}
    </CurrInlineCode>
  );
};

export default Literal;
