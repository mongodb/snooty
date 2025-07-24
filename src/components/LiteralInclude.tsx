import React from 'react';
import { ParentNode } from '../types/ast';
import ComponentFactory from './ComponentFactory';

const LiteralInclude = ({ nodeData: { children }, ...rest }: { nodeData: ParentNode }) => {
  return children.map((child, i) => <ComponentFactory {...rest} key={i} nodeData={child} />);
};

export default LiteralInclude;
