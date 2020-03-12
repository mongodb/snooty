import React from 'react';
import { css } from '@emotion/core';
import styled from '@emotion/styled';

import Button from '@leafygreen-ui/button';
import { Layout, RatingHeader, Footer } from '../components/view-components';
import useScreenshot from '../hooks/useScreenshot';
import { useFeedbackState } from '../context';
import ScreenshotButton from '../components/ScreenshotButton';
import { uiColors } from '@leafygreen-ui/palette';
import validateEmail from '../../../utils/validate-email';

function useValidation(inputValue, validator) {
  const [isValid, setIsValid] = React.useState(null);
  React.useEffect(() => {
    setIsValid(validator(inputValue));
  }, [inputValue, validator]);

  return isValid;
}

export default function CommentView({ ...props }) {
  const { feedback, isSupportRequest, submitComment, submitAllFeedback } = useFeedbackState();
  const { rating } = feedback || { rating: 3 };
  const isPositiveRating = rating > 3;
  const { screenshot, loading, takeScreenshot } = useScreenshot();

  const [comment, setComment] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [hasEmailError, setHasEmailError] = React.useState(false);
  const isValidEmail = useValidation(email, validateEmail);

  const handleSubmit = async () => {
    if (isValidEmail) {
      await submitComment({ comment, email });
      await submitAllFeedback();
    } else {
      setHasEmailError(true);
    }
  };

  return (
    <Layout>
      <RatingHeader isPositive={isPositiveRating} />
      <InputLabel htmlFor="feedback-comment">Describe your experience.</InputLabel>
      <CommentTextArea
        id="feedback-comment"
        rows={8}
        placeholder="Describe your experience."
        value={comment}
        onChange={e => setComment(e.target.value)}
      />
      <InputLabel htmlFor="feedback-email">Email Address (optional)</InputLabel>
      <EmailInput
        id="feedback-email"
        placeholder="someone@example.com"
        value={email}
        onChange={e => setEmail(e.target.value)}
      />
      {hasEmailError && <InputErrorLabel htmlFor="feedback-email">Please enter a valid email address.</InputErrorLabel>}
      {/* <CommentTextArea
        rows={8}
        placeholder="Describe your experience."
        value={comment}
        onChange={e => setComment(e.target.value)}
      />
      <EmailInput placeholder="Email Address (optional)" value={email} onChange={e => setEmail(e.target.value)} /> */}
      <Footer>
        <SubmitButton onClick={() => handleSubmit()}>{isSupportRequest ? 'Continue for Support' : 'Send'}</SubmitButton>
        {screenshot && <span>Screenshot attached</span>}
        <ScreenshotButton screenshot={screenshot} loading={loading} takeScreenshot={takeScreenshot} />
      </Footer>
    </Layout>
  );
}

const SubmitButton = styled(Button)``;
const InputStyle = css`
  padding: 14px;
  border: 0.5px solid ${uiColors.gray.base};
  border-radius: 2px;
  flex-grow: 1;
  line-height: 24px;
  font-size: 16px;
  max-height: 100%;
  width: 100%;
  margin-bottom: 16px;
  &:focus {
    outline: 0;
    box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.5);
  }
`;
const CommentTextArea = styled.textarea`
  ${InputStyle}
  resize: none;
`;
const EmailInput = styled.input`
  ${InputStyle}
`;
const InputLabel = styled.label`
  width: 100%;
  text-align: left;
`;
const InputErrorLabel = styled(InputLabel)`
  color: red;
  margin-top: -16px;
  margin-bottom: 16px;
`;
