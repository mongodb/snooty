import React from 'react';
import PropTypes from 'prop-types';
import { HeadingContextProvider } from '../context/heading-context';
import { getPlaintext } from '../utils/get-plaintext';
import { findKeyValuePair } from '../utils/find-key-value-pair';
import ComponentFactory from './ComponentFactory';

const Section = ({ sectionDepth, nodeData: { children }, ...rest }) => {
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

Section.propTypes = {
  sectionDepth: PropTypes.number,
  nodeData: PropTypes.shape({
    children: PropTypes.array.isRequired,
  }).isRequired,
};

Section.defaultProps = {
  sectionDepth: 0,
};

export default Section;
