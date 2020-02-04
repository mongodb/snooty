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
          <CardHeader>
            <CloseButton onClick={abandon} />
          </CardHeader>
          <Content>{children}</Content>
        </Card>
      </Floating>
    )
  );
}

const Floating = styled.div`
  position: fixed;
  top: 256px;
  right: 80px;
`;
const Card = styled(LeafygreenCard)`
  width: 420px;
`;
const CardHeader = styled.div`
  display: flex;
  justify-content: flex-end;
  padding: 4px;
`;
const Content = styled.div`
  padding: 0 28px 24px 28px;
`;
