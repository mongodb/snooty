import React from 'react';
import styled from '@emotion/styled';
import { palette } from '@leafygreen-ui/palette';
import LeafygreenCard from '@leafygreen-ui/card';
import { useFeedbackContext } from './context';
import { theme } from '../../../../src/theme/docsTheme';

const FeedbackContainer = styled(LeafygreenCard)`
  cursor: pointer;
  padding: 12px;
  position: fixed;
  user-select: none;
  z-index: 9;
  font-weight: 500;
  color: ${palette.green.dark1};

  // tab fixed at bottom of docs page
  @media ${theme.screenSize.upToSmall} {
    position: static !important;
    width: fit-content !important;
    margin-left: 20px;
    margin-top: -20px;
    margin-bottom: 20px;
    transform: rotate(0deg) !important;
  }

  @media ${theme.screenSize.smallAndUp} {
    // tab positioned on side of page
    @media ${theme.screenSize.upToLarge} {
      transform: rotate(-90deg);
      top: 50%;
      right: -53px;
    }

    // tab positioned on bottom right of page
    @media ${theme.screenSize.largeAndUp} {
      bottom: -6px;
      @media ${theme.screenSize.upTo2XLarge} {
        right: 16px;
      }
      @media ${theme.screenSize['2XLargeAndUp']} {
        right: 64px;
      }
    }
  }
`;

const FeedbackTab = () => {
  const { feedback, initializeFeedback } = useFeedbackContext();
  return !feedback && <FeedbackContainer onClick={() => initializeFeedback()}>Share Feedback</FeedbackContainer>;
};

export default FeedbackTab;
