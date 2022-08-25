import React from 'react';
import styled from '@emotion/styled';
import LeafygreenCard from '@leafygreen-ui/card';
import { useFeedbackState } from './context';
import { displayNone } from '../../../utils/display-none';
import { theme } from '../../../theme/docsTheme';

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

// TODO: resolve conflict with DOP-2400.
const Container = styled(LeafygreenCard)`
  position: fixed;
  bottom: -24px;
  right: 42px;
  padding: 12px;
  z-index: 9;
  border-radius: 7px;
  cursor: pointer;
  user-select: none;
  font-size: ${theme.fontSize.default};
`;
