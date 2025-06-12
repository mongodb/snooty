import React from 'react';
import type { ReleaseSpecificationNode } from '../types/ast';
import ComponentFactory from './ComponentFactory';

interface ReleaseSpecificationProps {
  nodeData: ReleaseSpecificationNode;
}

const ReleaseSpecification = ({ nodeData: { children }, ...rest }: ReleaseSpecificationProps) => {
  return children.map((child, i) => <ComponentFactory {...rest} key={i} nodeData={child} />);
};

export default ReleaseSpecification;
