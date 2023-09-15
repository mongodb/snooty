import React from 'react';
import { css, cx } from '@leafygreen-ui/emotion';
import { palette } from '@leafygreen-ui/palette';
import LeafygreenCard from '@leafygreen-ui/card';
import { theme } from '../../../../src/theme/docsTheme';
import { useFeedbackContext } from './context';

const containerStyle = css`
  cursor: pointer;
  padding: 12px;
  position: fixed;
  user-select: none;
  z-index: 9;
  font-weight: 500;
  color: ${palette.green.dark2};

  // tab fixed at bottom of docs page
  @media ${theme.screenSize.upToSmall} {
    display: flex;
    align-items: center;
    font-size: 16px;
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
      bottom: -24px;
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
  return (
    !feedback && (
      <LeafygreenCard className={cx(containerStyle)} onClick={() => initializeFeedback()}>
        Share Feedback
      </LeafygreenCard>
    )
  );
};

export default FeedbackTab;
