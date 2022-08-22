import React from 'react';
import { css } from '@emotion/react';
import styled from '@emotion/styled';
import Button from '@leafygreen-ui/button';
import { uiColors } from '@leafygreen-ui/palette';
import { Layout, RatingHeader, Footer } from '../components/view-components';
import { useFeedbackState } from '../context';
import useScreenshot from '../hooks/useScreenshot';
import { isBrowser } from '../../../../utils/is-browser';
import validateEmail from '../../../../utils/validate-email';
import Loadable from '@loadable/component';
const ScreenshotButton = Loadable(() => import('../components/ScreenshotButton'));

function useValidation(inputValue, validator) {
  const [isValid, setIsValid] = React.useState(null);
  React.useEffect(() => {
    setIsValid(validator(inputValue));
  }, [inputValue, validator]);

  return isValid;
}

export default function CommentView({ ...props }) {
  const { feedback, isSupportRequest, submitComment, submitAllFeedback, screenshotTaken } = useFeedbackState();
  const { rating } = feedback || { rating: 3 };
  const isPositiveRating = rating > 3;
  const { takeScreenshot } = useScreenshot();

  const [comment, setComment] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [hasEmailError, setHasEmailError] = React.useState(false);
  const isValidEmail = useValidation(email, validateEmail);

  const handleSubmit = async () => {
    if (isValidEmail && isBrowser) {
      if (screenshotTaken) {
        await takeScreenshot();
      }
      await submitComment({ comment, email });
      await submitAllFeedback();
    } else {
      setHasEmailError(true);
    }
  };

  return (
    <Layout>
      <RatingHeader isPositive={isPositiveRating} />
      <InputLabel htmlFor="feedback-comment">Comment</InputLabel>
      <CommentTextArea
        id="feedback-comment"
        placeholder="Describe your experience."
        rows={8}
        value={comment}
        onChange={(e) => setComment(e.target.value)}
      />
      <InputLabel htmlFor="feedback-email">Email Address</InputLabel>
      <EmailInput
        id="feedback-email"
        placeholder="someone@example.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      {hasEmailError && <InputErrorLabel htmlFor="feedback-email">Please enter a valid email address.</InputErrorLabel>}
      <Footer>
        <SubmitButton onClick={() => handleSubmit()}>{isSupportRequest ? 'Continue for Support' : 'Send'}</SubmitButton>
        <ScreenshotButton />
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
