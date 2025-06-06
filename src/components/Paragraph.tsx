import React from 'react';
import { css, cx } from '@leafygreen-ui/emotion';
import { Body } from '@leafygreen-ui/typography';
import { appendTrailingPunctuation } from '../utils/append-trailing-punctuation';
import { ParagraphNode } from '../types/ast';
import ComponentFactory from './ComponentFactory';

const SKIP_P_TAGS = new Set(['caption', 'footnote', 'field']);

const paragraphStyling = css`
  margin-bottom: 16px;
  color: var(--font-color-primary);
`;

export type ParagraphProps = {
  nodeData: ParagraphNode;
  parentNode?: string;
  skipPTag: boolean;
};

const Paragraph = ({ nodeData, parentNode, skipPTag, ...rest }: ParagraphProps) => {
  const children = appendTrailingPunctuation(nodeData.children);
  // For paragraph nodes that appear inside certain containers, skip <p> tags and just render their contents
  if (skipPTag || (parentNode && SKIP_P_TAGS.has(parentNode))) {
    return children.map((element, index) => <ComponentFactory {...rest} nodeData={element} key={index} />);
  }
  return (
    <Body className={cx(paragraphStyling)}>
      {children.map((element, index) => (
        <ComponentFactory {...rest} nodeData={element} key={index} />
      ))}
    </Body>
  );
};

export default Paragraph;
