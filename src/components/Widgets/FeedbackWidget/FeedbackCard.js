import React from 'react';
import LeafygreenCard from '@leafygreen-ui/card';
import styled from '@emotion/styled';

import CloseButton from './components/CloseButton';
import ProgressBar from './components/ProgressBar';
import { useFeedbackState } from './context';

export default function FeedbackCard({ isOpen, children }) {
  const { abandon } = useFeedbackState();

  return (
    isOpen && (
      <Floating>
        <Card>
          <ProgressBar/>
          <Content>{children}</Content>
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
  width: 230px;
`;
const CardHeader = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 10px;
  margin-right: 10px;
`;
const Content = styled.div`
  margin: 0px 24px 35px 24px;
`;
