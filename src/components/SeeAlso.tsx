import React, { useMemo } from 'react';
import { cx, css } from '@leafygreen-ui/emotion';
import { Body } from '@leafygreen-ui/typography';

import { theme } from '../theme/docsTheme';
import { getPlaintext } from '../utils/get-plaintext';
import { AdmonitionNode, ASTNode } from '../types/ast';
import ComponentFactory from './ComponentFactory';

const indentedContainerStyle = css`
  padding-left: ${theme.size.medium};
`;

const labelStyle = css`
  font-size: ${theme.fontSize.default};
  font-weight: 600;
  margin-bottom: ${theme.size.tiny};
`;

// Checks if all child content are unordered list nodes (no extra padding required)
const hasOnlyUnorderedLists = (children: ASTNode[]): boolean => {
  const isListNode = (nodeData: ASTNode) =>
    nodeData.type === 'list' && 'enumtype' in nodeData && nodeData.enumtype === 'unordered';
  return children.every((child) => isListNode(child));
};

interface SeeAlsoProps {
  nodeData: AdmonitionNode;
}

const SeeAlso = ({ nodeData: { argument, children }, ...rest }: SeeAlsoProps) => {
  const title = getPlaintext(argument);
  const onlyUnorderedLists = useMemo(() => hasOnlyUnorderedLists(children), [children]);

  return (
    <section>
      <Body className={cx(labelStyle)}>{`See also: ${title}`}</Body>
      <div className={cx(!onlyUnorderedLists && indentedContainerStyle)}>
        {children.map((child, i) => (
          <ComponentFactory {...rest} key={i} nodeData={child} />
        ))}
      </div>
    </section>
  );
};

export default SeeAlso;
