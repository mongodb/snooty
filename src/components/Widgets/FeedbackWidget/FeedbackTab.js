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

  // 320px breakpoint - hovering tab on bottom left
  @media ${theme.screenSize.upToSmall} {
    left: 20px;
    bottom: 20px;
  }

  @media ${theme.screenSize.smallAndUp} {
    // 768px breakpoint - side tab
    @media ${theme.screenSize.upToLarge} {
      transform: rotate(-90deg);
      top: 50%;
      right: -53px;
    }

    // bottom tab
    @media ${theme.screenSize.largeAndUp} {
      bottom: -6px;
      // 1024px breakpoint
      @media ${theme.screenSize.upTo2XLarge} {
        right: 16px;
      }

      // 1440px and 1920px breakpoints
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
