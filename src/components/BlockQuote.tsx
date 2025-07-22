import React from 'react';
import { BlockQuoteNode } from '../types/ast';
import ComponentFactory from './ComponentFactory';

const BlockQuote = ({ nodeData: { children }, ...rest }: { nodeData: BlockQuoteNode }) => (
  <blockquote>
    {children.map((element, index) => (
      <ComponentFactory {...rest} nodeData={element} key={index} />
    ))}
  </blockquote>
);

export default BlockQuote;
