import React from 'react';
import styled from '@emotion/styled';
import LeafygreenCard from '@leafygreen-ui/card';
import { useFeedbackState } from './context';
import { displayNone } from '../../../utils/display-none';

export default function FeedbackTab(props) {
  const { feedback, initializeFeedback } = useFeedbackState();
  return (
    !feedback && (
      <Container css={displayNone.onMobileAndTablet} onClick={() => initializeFeedback()}>
        Give Feedback
      </Container>
    )
  );
}

// TODO: DOP-2400 update styling for feedback tab.
// mocked bottom for card change
const Container = styled(LeafygreenCard)`
  bottom: -26px;
  cursor: pointer;
  padding: 12px;
  position: fixed;
  right: 42px;
  user-select: none;
  z-index: 9;
`;
