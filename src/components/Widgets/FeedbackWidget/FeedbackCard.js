import React from 'react';
import LeafygreenCard from '@leafygreen-ui/card';
import styled from '@emotion/styled';

import ProgressBar from './components/ProgressBar';

export default function FeedbackCard({ isOpen, children }) {
  return (
    isOpen && (
      <Floating>
        <LeafygreenCard>
          <ProgressBar />
          <Content>{children}</Content>
        </LeafygreenCard>
      </Floating>
    )
  );
}

const Floating = styled.div`
  position: fixed;
  bottom: 40px;
  right: 16px;
  z-index: 10;
`;
const Content = styled.div`
  margin: 0px 32px 35px;
`;
