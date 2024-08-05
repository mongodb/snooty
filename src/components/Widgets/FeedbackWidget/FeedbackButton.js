import React from 'react';
import Button from '@leafygreen-ui/button';
import { useFeedbackContext } from './context';
import { FEEDBACK_BUTTON_TEXT } from './constants';

const FeedbackButton = () => {
  const { initializeFeedback, abandon, feedback } = useFeedbackContext();
  return <Button onClick={() => (!feedback ? initializeFeedback() : abandon())}>{FEEDBACK_BUTTON_TEXT}</Button>;
};

export default FeedbackButton;
