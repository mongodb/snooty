import React from 'react';
import { css } from '@emotion/react';
import LeafygreenCard from '@leafygreen-ui/card';
import styled from '@emotion/styled';
import CloseButton from './components/CloseButton';
import { useFeedbackState } from './context';
import { feedbackId } from '../FeedbackWidget/FeedbackForm';

const feedbackStyle = css`
  z-index: 14;
`;

export default function FeedbackCard({ isOpen, children }) {
  const { abandon } = useFeedbackState();

  return (
    isOpen && (
      <Floating id={feedbackId} css={feedbackStyle}>
        <Card>
          <CardHeader>
            <CloseButton onClick={() => abandon()} />
          </CardHeader>
          <Content>{children}</Content>
        </Card>
      </Floating>
    )
  );
}

const Floating = styled.div`
  position: fixed;
  bottom: 40px;
  right: 40px;
  z-index: 20;
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
`;
