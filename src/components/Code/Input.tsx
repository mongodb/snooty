import React from 'react';
import ComponentFactory from '../ComponentFactory';
import { ParentNode } from '../../types/ast';

const Input = ({ nodeData: { children }, ...rest }: { nodeData: ParentNode }) => {
  return children.map((child, i) => <ComponentFactory {...rest} key={i} nodeData={child} />);
};

export default Input;
