import React from 'react';
import styled from '@emotion/styled';
import { ComposableNode } from '../../types/ast';
import ComponentFactory from '../ComponentFactory';
import { theme } from '../../theme/docsTheme';

interface ComposableProps {
  nodeData: ComposableNode;
}

const StyledContainer = styled.div`
  > *:first-child {
    margin-top: ${theme.size.medium};
  }
`;

const Composable = ({ nodeData: { children }, ...rest }: ComposableProps) => {
  return (
    <StyledContainer>
      {children.map((c, i) => (
        <ComponentFactory nodeData={c} key={i} {...rest} />
      ))}
    </StyledContainer>
  );
};

export default Composable;
