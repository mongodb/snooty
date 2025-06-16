import React from 'react';
import ComponentFactory from '../ComponentFactory';
import { ParentNode } from '../../types/ast';

export type RoleFileProps = {
  nodeData: ParentNode;
};

const RoleFile = ({ nodeData: { children } }: RoleFileProps) => (
  <code className="file docutils literal">
    <span className="pre">
      {children.map((node, i) => (
        <ComponentFactory key={i} nodeData={node} />
      ))}
    </span>
  </code>
);

export default RoleFile;
