import React from 'react';
import { HeadingContextProvider } from '../context/heading-context';
import { getPlaintext } from '../utils/get-plaintext';
import { findKeyValuePair } from '../utils/find-key-value-pair';
import { ParentNode } from '../types/ast';
import ComponentFactory from './ComponentFactory';

export type SectionProps = {
  sectionDepth: number;
  nodeData: ParentNode;
};

const Section = ({ sectionDepth = 0, nodeData: { children }, ...rest }: SectionProps) => {
  const headingNode = findKeyValuePair(children, 'type', 'heading');

  return (
    <HeadingContextProvider heading={getPlaintext(headingNode?.children ?? [])}>
      <section>
        {children.map((child, index) => {
          return <ComponentFactory {...rest} nodeData={child} key={index} sectionDepth={sectionDepth + 1} />;
        })}
      </section>
    </HeadingContextProvider>
  );
};

export default Section;
