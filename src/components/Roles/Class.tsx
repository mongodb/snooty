import React from 'react';
import ComponentFactory from '../ComponentFactory';
import { ClassRoleNode } from '../../types/ast';

export type RoleClassProps = {
  nodeData: ClassRoleNode;
};

const RoleClass = ({ nodeData: { children, target } }: RoleClassProps) => (
  <a href={`${target}`}>
    {children.map((node, i) => (
      <ComponentFactory key={i} nodeData={node} />
    ))}
  </a>
);

export default RoleClass;
