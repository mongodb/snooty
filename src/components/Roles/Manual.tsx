import React from 'react';
import ComponentFactory from '../ComponentFactory';
import { REF_TARGETS } from '../../constants';
import { RoleManualNode } from '../../types/ast';

export type RoleManualProps = {
  nodeData: RoleManualNode;
};

const RoleManual = ({ nodeData: { children, target } }: RoleManualProps) => {
  return (
    <a href={`${REF_TARGETS.manual}${target.replace('/manual', '')}`}>
      {children.map((node, i) => (
        <ComponentFactory key={i} nodeData={node} />
      ))}
    </a>
  );
};

export default RoleManual;
