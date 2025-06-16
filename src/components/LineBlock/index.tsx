import React from 'react';
import ComponentFactory from '../ComponentFactory';
import { ParentNode } from '../../types/ast';

export type LineBlockProps = {
  nodeData: ParentNode;
};

const LineBlock = ({ nodeData: { children }, ...rest }: LineBlockProps) => (
  <div className="line-block">
    {children.map((child, index) => (
      <ComponentFactory key={index} {...rest} nodeData={child} />
    ))}
  </div>
);

export default LineBlock;
