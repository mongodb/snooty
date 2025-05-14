import React from 'react';
import PropTypes from 'prop-types';
import ComponentFactory from './ComponentFactory';

const Glossary = ({ nodeData: { children }, ...rest }) => (
  <>
    {children.map((node, index) => (
      <ComponentFactory {...rest} nodeData={node} key={index} />
    ))}
  </>
);

Glossary.propTypes = {
  nodeData: PropTypes.shape({
    children: PropTypes.arrayOf(PropTypes.object).isRequired,
  }).isRequired,
};

export default Glossary;
