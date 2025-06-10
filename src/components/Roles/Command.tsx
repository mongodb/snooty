import React from 'react';
import ComponentFactory from '../ComponentFactory';
import { ParentNode } from '../../types/ast';

const RoleCommand = ({ nodeData: { children }, ...rest }: { nodeData: ParentNode }) => (
  <strong>
    {children.map((child, i) => (
      <ComponentFactory {...rest} key={i} nodeData={child} />
    ))}
  </strong>
);

export default RoleCommand;
