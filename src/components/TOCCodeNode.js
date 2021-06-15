import React from 'react';
import PropTypes from 'prop-types';

const styleTOCCodeNode = {
  fontFamily: 'Source Code Pro',
};

const TOCCodeNode = ({ nodeData: { children } }) => (
  <span style={styleTOCCodeNode}>
    {console.log(children[0].value)}
    {children[0].value}
  </span>
);

TOCCodeNode.propTypes = {
  nodeData: PropTypes.shape({
    children: PropTypes.arrayOf(PropTypes.object).isRequired,
  }).isRequired,
};

export default TOCCodeNode;
