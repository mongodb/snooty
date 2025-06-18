import React from 'react';
import ComponentFactory from '../ComponentFactory';
import { DefinitionListNode } from '../../types/ast';

export type DefinitionListProps = {
  nodeData: DefinitionListNode;
}

const DefinitionList = ({ nodeData, ...rest }: DefinitionListProps) => {
  return (
    <dl>
      {nodeData.children.map((definition, index) => (
        <ComponentFactory {...rest} nodeData={definition} key={index} />
      ))}
    </dl>
  );
};

export default DefinitionList;
