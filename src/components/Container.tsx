import React from 'react';
import { ContainerNode } from '../types/ast';
import ComponentFactory from './ComponentFactory';

const Container = ({ nodeData: { argument, children }, ...rest }: { nodeData: ContainerNode }) => {
  const customClass = argument.map((node) => node.value).join(' ');
  return (
    <div className={`${customClass} docutils container`}>
      {children.map((element, index) => (
        <ComponentFactory {...rest} nodeData={element} key={index} />
      ))}
    </div>
  );
};

export default Container;
