import React from 'react';
import styled from '@emotion/styled';
import { theme } from '../theme/docsTheme';
import type { StandaloneHeaderNode } from '../types/ast';
import ComponentFactory from './ComponentFactory';
import SectionHeader from './SectionHeader';
import Link from './Link';

const StyledStandaloneContainer = styled.div`
  align-items: center;
  column-gap: 16px;
  display: flex;
  margin-bottom: 12px;

  @media ${theme.screenSize.mediumAndUp} {
    margin-bottom: 24px;
  }
`;

interface StandaloneHeaderProps {
  nodeData: StandaloneHeaderNode;
}

const StandaloneHeader = ({ nodeData: { argument, options } }: StandaloneHeaderProps) => {
  return (
    <StyledStandaloneContainer>
      <SectionHeader>
        {argument.map((child, i) => (
          <ComponentFactory nodeData={child} key={i} />
        ))}
      </SectionHeader>
      <Link to={options.url} showLinkArrow={true}>
        {options.cta}
      </Link>
    </StyledStandaloneContainer>
  );
};

export default StandaloneHeader;
