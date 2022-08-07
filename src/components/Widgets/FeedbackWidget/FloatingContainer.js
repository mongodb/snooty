import React from 'react';
import { css } from '@emotion/react';
import LeafygreenCard from '@leafygreen-ui/card';
import styled from '@emotion/styled';
import ProgressBar from './components/PageIndicators';
import CloseButton from './components/CloseButton';
import { useFeedbackState } from './context';
import { feedbackId } from '../FeedbackWidget/FeedbackForm';

const feedbackStyle = css`
  z-index: 14;
`;

export default function FloatingContainer({ isOpen, children }) {
  const { abandon } = useFeedbackState();

  return (
    isOpen && (
      <Floating id={feedbackId} css={feedbackStyle}>
        <Card>
          <CardHeader>
            <ProgressBar />
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
  right: 16px;
  z-index: 20;
`;

const Card = styled(LeafygreenCard)`
  /* Card Size */
  width: 234px;
  min-height: 320px;
  max-height: 320px;
  align-items: center;
  /* White */
  box-shadow: 0px 8px 20px -8px rgba(6, 22, 33, 0.6);
  border-radius: 7px;
`;
const CardHeader = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 3px;
  margin-right: 10px;
`;
const Content = styled.div`
  margin: 0px 24px;
`;
