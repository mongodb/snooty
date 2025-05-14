import React from 'react';
import PropTypes from 'prop-types';
import ComponentFactory from './ComponentFactory';

const BlockQuote = ({ nodeData: { children }, ...rest }) => (
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
