import React from 'react';
import PropTypes from 'prop-types';
import { BlockQuoteNode } from '../types/ast';
import ComponentFactory from './ComponentFactory';

export type BlockQuoteProps = {
  nodeData: BlockQuoteNode;
};

const BlockQuote = ({ nodeData: { children }, ...rest }: BlockQuoteProps) => (
  <blockquote>
    {children.map((element, index) => (
      <ComponentFactory {...rest} nodeData={element} key={index} />
    ))}
  </blockquote>
);

BlockQuote.propTypes = {
  nodeData: PropTypes.shape({
    children: PropTypes.array.isRequired,
  }).isRequired,
};

export default BlockQuote;
