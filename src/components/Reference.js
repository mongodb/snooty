import React from 'react';
import PropTypes from 'prop-types';
import ComponentFactory from './ComponentFactory';
import StyledLink from './StyledLink';

const Reference = ({ nodeData }) => (
  <StyledLink to={nodeData.refuri}>
    {nodeData.children.map((element, index) => (
      <ComponentFactory key={index} nodeData={element} />
    ))}
  </StyledLink>
);

Reference.propTypes = {
  nodeData: PropTypes.shape({
    children: PropTypes.array.isRequired,
    refuri: PropTypes.string.isRequired,
  }).isRequired,
};

export default Reference;
