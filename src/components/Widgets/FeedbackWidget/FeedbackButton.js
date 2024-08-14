import React from 'react';
import Button from '@leafygreen-ui/button';
import { css, cx } from '@leafygreen-ui/emotion';
import { palette } from '@leafygreen-ui/palette';
import { useFeedbackContext } from './context';
import { FEEDBACK_BUTTON_TEXT } from './constants';

const darkModePrestyling = css`
  color: var(--feedback-font-color);
  background: var(--feedback-background-color);
  border-color: ${palette.gray.base};

  --feedback-font-color: ${palette.black};
  --feedback-background-color: ${palette.gray.light3};

  .dark-theme & {
    --feedback-font-color: ${palette.white};
    --feedback-background-color: ${palette.gray.dark2};
  }
`;

const FeedbackButton = () => {
  const { initializeFeedback, abandon, feedback } = useFeedbackContext();
  return (
    <Button className={cx(darkModePrestyling)} onClick={() => (!feedback ? initializeFeedback() : abandon())}>
      {FEEDBACK_BUTTON_TEXT}
    </Button>
  );
};

export default FeedbackButton;
