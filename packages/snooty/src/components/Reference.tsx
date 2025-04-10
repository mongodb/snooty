import React from 'react';
import { ReferenceNode } from '../types/ast';
import ComponentFactory from './ComponentFactory';
import Link from './Link';

export type ReferenceProps = {
  nodeData: ReferenceNode;
};

const Reference = ({ nodeData, ...rest }: ReferenceProps) => {
  return (
    <Link to={nodeData.refuri} {...rest}>
      {nodeData.children.map((element, index) => (
        <ComponentFactory key={index} nodeData={element} />
      ))}
    </Link>
  );
};

export default Reference;
