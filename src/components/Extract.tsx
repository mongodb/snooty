import React from 'react';
import { ParentNode } from '../types/ast';
import ComponentFactory from './ComponentFactory';

const Extract = ({ nodeData: { children }, ...rest }: { nodeData: ParentNode }) =>
  children.map((child, i) => <ComponentFactory {...rest} key={i} nodeData={child} />);

export default Extract;
