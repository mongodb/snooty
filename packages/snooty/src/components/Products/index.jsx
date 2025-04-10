import React from 'react';
import styled from '@emotion/styled';
import PropTypes from 'prop-types';
import ComponentFactory from '../ComponentFactory';

const StyledSectionContainer = styled.section`
  display: grid;
  grid-template-columns: minmax(64px, 1fr) repeat(12, minmax(0, 120px)) minmax(64px, 1fr);
  margin-bottom: 56px;
  margin-top: 60px;
`;

const Products = ({ nodeData: { children } }) => {
  return (
    <StyledSectionContainer>
      {children.map((child, i) => (
        <ComponentFactory nodeData={child} key={i} />
      ))}
    </StyledSectionContainer>
  );
};

Products.prototype = {
  nodeData: PropTypes.shape({
    children: PropTypes.arrayOf(PropTypes.object).isRequired,
  }).isRequired,
};

export default Products;
