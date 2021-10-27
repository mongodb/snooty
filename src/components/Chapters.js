import React from 'react';
import styled from '@emotion/styled';
import { uiColors } from '@leafygreen-ui/palette';
import ComponentFactory from './ComponentFactory';

const Container = styled('div')`
  background-color: ${uiColors.gray.light3};
  max-width: 100%;
`;

const Chapters = ({ metadata, nodeData: { children } }) => {
  return (
    <Container>
      {children.map((child, i) => (
        <ComponentFactory key={i} metadata={metadata} nodeData={child} />
      ))}
    </Container>
  );
};

export default Chapters;
