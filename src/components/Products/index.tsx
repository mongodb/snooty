import React from 'react';
import styled from '@emotion/styled';
import ComponentFactory from '../ComponentFactory';
import { ParentNode } from '../../types/ast';

const StyledSectionContainer = styled.section`
  display: grid;
  grid-template-columns: minmax(64px, 1fr) repeat(12, minmax(0, 120px)) minmax(64px, 1fr);
  margin-bottom: 56px;
  margin-top: 60px;
`;

const Products = ({ nodeData: { children } }: { nodeData: ParentNode }) => {
  return (
    <StyledSectionContainer>
      {children.map((child, i) => (
        <ComponentFactory nodeData={child} key={i} />
      ))}
    </StyledSectionContainer>
  );
};

export default Products;
