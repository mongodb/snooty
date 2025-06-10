import React from 'react';
import ComponentFactory from '../ComponentFactory';
import { ParentNode } from '../../types/ast';

const RoleFile = ({ nodeData: { children } }: { nodeData: ParentNode }) => (
  <code className="file docutils literal">
    <span className="pre">
      {children.map((node, i) => (
        <ComponentFactory key={i} nodeData={node} />
      ))}
    </span>
  </code>
);

export default RoleFile;
