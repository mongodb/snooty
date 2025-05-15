import React from 'react';
import { ParentNode } from '../types/ast';
import ComponentFactory from './ComponentFactory';

const Glossary = ({ nodeData: { children }, ...rest }: { nodeData: ParentNode }) => (
  <>
    {children.map((node, index) => (
      <ComponentFactory {...rest} nodeData={node} key={index} />
    ))}
  </>
);

export default Glossary;
