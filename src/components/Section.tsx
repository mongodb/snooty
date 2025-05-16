import React from 'react';
import { HeadingContextProvider } from '../context/heading-context';
import { getPlaintext } from '../utils/get-plaintext';
import { findKeyValuePair } from '../utils/find-key-value-pair';
import { HeadingNode, ParentNode } from '../types/ast';
import { isHeadingNode } from '../types/ast-utils';
import ComponentFactory from './ComponentFactory';

const Section = ({
  sectionDepth = 0,
  nodeData: { children },
  ...rest
}: {
  sectionDepth?: number;
  nodeData: ParentNode;
}) => {
  let headingText = '';
  // TODO: Remove this type-casting when CommonJS files can be typed correctly
  const headingNode = findKeyValuePair(children, 'type', 'heading') as HeadingNode | undefined;

  if (headingNode && isHeadingNode(headingNode)) {
    headingText = getPlaintext(headingNode.children);
  }

  return (
    <HeadingContextProvider heading={headingText}>
      <section>
        {children.map((child, index) => {
          return <ComponentFactory {...rest} nodeData={child} key={index} sectionDepth={sectionDepth + 1} />;
        })}
      </section>
    </HeadingContextProvider>
  );
};

export default Section;
