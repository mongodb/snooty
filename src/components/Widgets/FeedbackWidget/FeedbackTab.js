import React from 'react';
import styled from '@emotion/styled';
import { palette } from '@leafygreen-ui/palette';
import LeafygreenCard from '@leafygreen-ui/card';
import { useFeedbackContext } from './context';
import { displayNone } from '../../../utils/display-none';

const FeedbackContainer = styled(LeafygreenCard)`
  bottom: -24px;
  cursor: pointer;
  padding: 12px;
  position: fixed;
  right: 16px;
  user-select: none;
  z-index: 9;
  font-weight: 500;
  color: ${palette.green.dark1};
`;

const FeedbackTab = () => {
  const { feedback, initializeFeedback } = useFeedbackContext();
  return (
    !feedback && (
      <FeedbackContainer css={displayNone.onMobileAndTablet} onClick={() => initializeFeedback()}>
        Share Feedback
      </FeedbackContainer>
    )
  );
};

export default FeedbackTab;
