import React from 'react';
import ComponentFactory from '../ComponentFactory';
import { ParentNode } from '../../types/ast';

export type LineProps = {
  nodeData: ParentNode;
};

const Line = ({ nodeData: { children }, ...rest }: LineProps) => {
  if (children.length !== 0) {
    return (
      <div className="line">
        {children.map((child, index) => (
          <ComponentFactory key={index} {...rest} nodeData={child} />
        ))}
      </div>
    );
  }
  return (
    <div className="line">
      <br />
    </div>
  );
};

export default Line;
