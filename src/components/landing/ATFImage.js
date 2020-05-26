import React from 'react';
import styled from '@emotion/styled';
import ComponentFactory from '../ComponentFactory';

const RightAlignContainer = styled('div')`
  grid-column-start: 2;
`;

const ATFImage = ({ nodeData: { children }, ...rest }) => (
  <RightAlignContainer>
    {children.map((child, i) => (
      <ComponentFactory nodeData={child} key={i} {...rest} />
    ))}
  </RightAlignContainer>
);

export default ATFImage;
