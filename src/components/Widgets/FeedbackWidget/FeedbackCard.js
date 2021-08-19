import React from 'react';
import Card from '@leafygreen-ui/card';
import styled from '@emotion/styled';

import ProgressBar from './components/ProgressBar';

export default function FeedbackCard({ isOpen, children }) {
  return (
    isOpen && (
      <Floating>
        <StyledCard>
          <ProgressBar />
          <Content>{children}</Content>
        </StyledCard>
      </Floating>
    )
  );
}

const StyledCard = styled(Card)`
  width: 235px !important;
`;

const Floating = styled.div`
  position: fixed;
  bottom: 40px;
  right: 16px;
  z-index: 10;
`;
const Content = styled.div`
  margin: 0px 32px 35px;
`;
