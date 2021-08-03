import React from 'react';
import LeafygreenCard from '@leafygreen-ui/card';
import styled from '@emotion/styled';

import CloseButton from './components/CloseButton';
import { useFeedbackState } from './context';

export default function FeedbackCard({ isOpen, children }) {
  const { abandon } = useFeedbackState();

  return (
    isOpen && (
      <Floating>
        <Card>
          <Heading />
          <Content>{children}</Content>
          <CloseButton onClick={() => abandon()} />
        </Card>
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
const Card = styled(LeafygreenCard)`
  width: 320px;
`;
const CardHeader = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 10px;
  margin-right: 10px;
`;
const Content = styled.div`
  margin: 0px 24px;
  display: inline-block;
`;
