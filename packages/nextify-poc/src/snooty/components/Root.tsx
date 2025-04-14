import React from 'react';
import { Root as RootNode } from '../types/ast';
import ComponentFactory from './ComponentFactory';

const Root = ({ nodeData: { children }, ...rest }: { nodeData: RootNode }) =>
  children.map((child, i) => <ComponentFactory {...rest} key={i} nodeData={child} />);

export default Root;
