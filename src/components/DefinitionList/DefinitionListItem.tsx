import React from 'react';
import styled from '@emotion/styled';
import { css } from '@leafygreen-ui/emotion';
import ComponentFactory from '../ComponentFactory';
import { theme } from '../../theme/docsTheme';
import { findKeyValuePair } from '../../utils/find-key-value-pair';
import { DefinitionListItemNode, InlineTargetNode } from '../../types/ast';

const HeaderBuffer = styled.div`
  display: inline;
  margin-top: -${theme.header.navbarScrollOffset};
  position: absolute;
  // Add a bit of padding to help headings be more accurately set as "active" on FF and Safari
  padding-bottom: 2px;
`;

export type DefinitionListItemProps = {
  nodeData: DefinitionListItemNode;
}

const DefinitionListItem = ({ nodeData: { children, term }, ...rest }: DefinitionListItemProps) => {
  const termProps = {};
  const targetIdentifier = findKeyValuePair(term, 'type', 'inline_target') as InlineTargetNode | undefined;

  return (
    <>
      {targetIdentifier && <HeaderBuffer id={targetIdentifier.html_id} />}
      <dt {...termProps}>
        {term.map((child, index) => (
          <ComponentFactory nodeData={child} key={`dt-${index}`} />
        ))}
      </dt>
      <dd
        className={css`
          p:first-of-type {
            margin-top: 0 !important;
          }
        `}
      >
        {children.map((child, index) => (
          <ComponentFactory {...rest} nodeData={child} key={`dd-${index}`} skipPTag={children.length === 1} />
        ))}
      </dd>
    </>
  );
};

export default DefinitionListItem;
