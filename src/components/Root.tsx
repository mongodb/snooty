import React from 'react';
import { Root as RootNode } from '../types/ast';
import ComponentFactory from './ComponentFactory';

const Root = ({ nodeData, ...rest }: { nodeData: RootNode }) => {
  console.log('Root?? ', nodeData);

  return nodeData.children.map((child, i) => <ComponentFactory {...rest} key={i} nodeData={child} />);
};

export default Root;
