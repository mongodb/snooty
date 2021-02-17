import React from 'react';
import { css } from '@emotion/core';
import styled from '@emotion/styled';
import LeafygreenCard from '@leafygreen-ui/card';
import { useFeedbackState } from './context';
import { theme } from '../../../theme/docsTheme';

export default function FeedbackTab(props) {
  const { feedback, initializeFeedback } = useFeedbackState();
  return (
    !feedback && (
      <Container
        css={css`
          @media ${theme.screenSize.upToLarge} {
            display: none;
          }
        `}
        onClick={() => initializeFeedback()}
      >
        Give Feedback
      </Container>
    )
  );
}

const Container = styled(LeafygreenCard)`
  bottom: -6px;
  cursor: pointer;
  padding: 12px;
  position: fixed;
  right: 42px;
  user-select: none;
  z-index: 9;
`;
