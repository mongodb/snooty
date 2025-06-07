import React from 'react';
import type { SubscriptNode } from '../types/ast';
import ComponentFactory from './ComponentFactory';

interface SubscriptProps {
  nodeData: SubscriptNode;
}

const Subscript = ({ nodeData, ...rest }: SubscriptProps) => (
  <sub>
    {nodeData.children.map((child, index) => (
      <ComponentFactory {...rest} key={index} nodeData={child} />
    ))}
  </sub>
);

export default Subscript;
