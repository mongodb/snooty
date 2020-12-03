import React from 'react';
import styled from '@emotion/styled';
import { useFeedbackState } from './context';
import useScreenSize from '../../../hooks/useScreenSize';

import LeafygreenCard from '@leafygreen-ui/card';

export default function FeedbackTab(props) {
  const { feedback, initializeFeedback } = useFeedbackState();
  const { isTabletOrMobile } = useScreenSize();
  const shouldShowFeedbackTab = !feedback && !isTabletOrMobile;
  return shouldShowFeedbackTab && <Container onClick={() => initializeFeedback()}>Give Feedback</Container>;
}

const Container = styled(LeafygreenCard)`
  padding: 12px;
  position: fixed;
  bottom: -6px;
  right: 42px;
  user-select: none;
  cursor: pointer;
  z-index: 9;
`;
