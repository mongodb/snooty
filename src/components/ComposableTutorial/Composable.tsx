import React from 'react';
import { ComposableNode } from '../../types/ast';
import ComponentFactory from '../ComponentFactory';

interface ComposableProps {
  nodeData: ComposableNode;
}

const Composable = ({ nodeData: { children }, ...rest }: ComposableProps) => {
  return (
    <div>
      {children.map((c, i) => (
        <ComponentFactory nodeData={c} key={i} {...rest} />
      ))}
    </div>
  );
};

export default Composable;
