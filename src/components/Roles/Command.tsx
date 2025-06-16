import React from 'react';
import ComponentFactory from '../ComponentFactory';
import { ParentNode } from '../../types/ast';

export type RoleCommandProps = {
  nodeData: ParentNode;
};

const RoleCommand = ({ nodeData: { children }, ...rest }: RoleCommandProps) => (
  <strong>
    {children.map((child, i) => (
      <ComponentFactory {...rest} key={i} nodeData={child} />
    ))}
  </strong>
);

export default RoleCommand;
