import React from 'react';
import { ParentNode } from '../types/ast';
import ComponentFactory from './ComponentFactory';

const LiteralBlock = ({ nodeData: { children }, ...rest }: { nodeData: ParentNode }) => (
  <div className="highlight-default">
    <div className="highlight">
      <pre>
        {children.map((child, index) => (
          <ComponentFactory {...rest} key={index} nodeData={child} />
        ))}
      </pre>
    </div>
  </div>
);

export default LiteralBlock;
