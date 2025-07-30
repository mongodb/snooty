import React from 'react';
import type { SuperscriptNode } from '../types/ast';
import ComponentFactory from './ComponentFactory';

interface SuperscriptProps {
  nodeData: SuperscriptNode;
}

const Superscript = ({ nodeData, ...rest }: SuperscriptProps) => (
  <sup>
    {nodeData.children.map((child, index) => (
      <ComponentFactory {...rest} key={index} nodeData={child} />
    ))}
  </sup>
);

export default Superscript;
