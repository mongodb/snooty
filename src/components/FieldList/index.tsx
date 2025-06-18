import React from 'react';
import styled from '@emotion/styled';
import ComponentFactory from '../ComponentFactory';
import { theme } from '../../theme/docsTheme';
import { FieldListNode } from '../../types/ast';

const Table = styled('table')`
  border-spacing: 0;
  font-size: ${theme.fontSize.small};
  line-height: ${theme.size.medium};
  margin: ${theme.size.medium} 0;
  max-width: 100%;

  tbody {
    vertical-align: top;
  }
`;

export type FieldListProps = {
  nodeData: FieldListNode;
}

const FieldList = ({ nodeData: { children }, ...rest }: FieldListProps) => (
  <Table>
    <colgroup>
      <col className="field-name" />
      <col className="field-body" />
    </colgroup>
    <tbody>
      {children.map((element, index) => (
        <ComponentFactory {...rest} nodeData={element} key={index} />
      ))}
    </tbody>
  </Table>
);

export default FieldList;
