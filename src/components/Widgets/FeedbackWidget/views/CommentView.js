import React, { useState, useEffect } from 'react';
import { css } from '@emotion/react';
import styled from '@emotion/styled';
import TextArea from '@leafygreen-ui/text-area';
import TextInput from '@leafygreen-ui/text-input';
import Button from '@leafygreen-ui/button';
import { palette } from '@leafygreen-ui/palette';
import Loadable from '@loadable/component';
import { Layout, CommentHeader, Footer } from '../components/view-components';
import { useFeedbackState } from '../context';
import useViewport from '../../../../hooks/useViewport';
import validateEmail from '../../../../utils/validate-email';
import { retrieveDataUri } from '../handleScreenshot';
const ScreenshotButton = Loadable(() => import('../components/ScreenshotButton'));

function useValidation(inputValue, validator) {
  const [isValid, setIsValid] = React.useState(null);
  React.useEffect(() => {
    setIsValid(validator(inputValue));
  }, [inputValue, validator]);

  return isValid;
}

export default function CommentView({ ...props }) {
  const {
    feedback,
    isSupportRequest,
    selectedSentiment,
    submitComment,
    submitAllFeedback,
    submitScreenshot,
    screenshotTaken,
  } = useFeedbackState();
  const placeholderText =
    selectedSentiment === 'Positive'
      ? 'How did this page help you?'
      : selectedSentiment === 'Negative'
      ? 'How could this page be more helpful?'
      : 'What change would you like to see?';
  const viewport = useViewport();
  const [comment, setComment] = useState('');
  const [email, setEmail] = useState('');
  const [hasEmailError, setHasEmailError] = useState(false);
  const isValidEmail = useValidation(email, validateEmail);

  const handleSubmit = async () => {
    if (isValidEmail) {
      if (screenshotTaken) {
        const dataUri = await retrieveDataUri();
        await submitScreenshot({ dataUri, viewport });
      }
      await submitComment({ comment, email });
      await submitAllFeedback();
    } else {
      setHasEmailError(true);
    }
  };

  return (
    <Layout>
      <CommentHeader />
      <StyledCommentInput
        id="feedback-comment"
        label={'Comment'}
        placeholder={placeholderText}
        value={comment}
        rows={4}
        onChange={(e) => setComment(e.target.value)}
      ></StyledCommentInput>
      <ScreenshotButton />
      <StyledEmailInput
        id="feedback-email"
        placeholder="Email Address"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        type={'email'}
      ></StyledEmailInput>
      <EmailElement>
        <OptionalText style={{ display: hasEmailError ? 'none' : '' }}>{'Optional'}</OptionalText>
        <ErrorDisplay style={{ display: hasEmailError ? '' : 'none' }}>
          <ErrorIcon></ErrorIcon>
        </ErrorDisplay>
      </EmailElement>
      <InputErrorLabel htmlFor="feedback-email" style={{ display: hasEmailError ? '' : 'none' }}>
        Please enter a valid email.
      </InputErrorLabel>
      <Footer>
        <SubmitButton onClick={() => handleSubmit()}>{'Send'}</SubmitButton>
      </Footer>
    </Layout>
  );
}

const ErrorIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      fill-rule="evenodd"
      clip-rule="evenodd"
      d="M7.8639 1.01357C7.49039 0.328811 6.50961 0.328811 6.1361 1.01357L0.122178 12.0388C-0.236737 12.6968 0.238139 13.5 0.986079 13.5H13.0139C13.7619 13.5 14.2367 12.6968 13.8778 12.0388L7.8639 1.01357ZM6 4.5C6 3.94772 6.44772 3.5 7 3.5C7.55228 3.5 8 3.94772 8 4.5V8.5C8 9.05228 7.55228 9.5 7 9.5C6.44772 9.5 6 9.05228 6 8.5V4.5ZM8 11.5C8 12.0523 7.55228 12.5 7 12.5C6.44772 12.5 6 12.0523 6 11.5C6 10.9477 6.44772 10.5 7 10.5C7.55228 10.5 8 10.9477 8 11.5Z"
      fill="#DB3030"
    />
  </svg>
);

const ErrorDisplay = styled.span`
  margin-left: 30px;
`;

const OptionalText = styled.div`
  font-family: 'Akzidenz-Grotesk Std';
  font-style: italic;
  font-weight: 300;
  font-size: 13px;
`;
const EmailElement = styled.div`
  width: 44px;
  height: 20px;
  font-family: 'Akzidenz-Grotesk Std';
  font-style: italic;
  font-weight: 300;
  font-size: 13px;
  line-height: 20px;
  /* identical to box height, or 167% */
  color: #5d6c74;
  margin-top: -25px !important;
  margin-left: 130px !important;
  margin-bottom: 5px;
  z-index: 10 !important;
  background: #ffffff;
`;

const SubmitButton = styled(Button)`
  margin-top: 20px !important;
  margin-right: -8px !important;
  height: 28px !important;
  width: 55px;
  box-shadow: 0px 1px 2px rgba(6, 22, 33, 0.3);
  :focus {
    box-shadow: 0px 1px 2px rgba(6, 22, 33, 0.3);
  }
  text-align: center;
  font-size: ${theme.fontSize.default};
  font-weight: 399;
  font-family: 'Akzidenz-Grotesk Std';
  font-style: normal;

  background: #f9fbfa;
  //position: fixed;
  justify-content: center;
  align-items: center;
  padding: 1px 12px 3px;
  gap: 6px;
  border-radius: 4px;
`;

const InputErrorLabel = styled.label`
  color: red;
  text-align: center;
  margin-top: 5px;
  margin-left: -43px;
  font-size: 13px;
  margin-bottom: -5px;
`;

const StyledCommentInput = styled(TextArea)`
  width: 202px;
  margin-top: -16px;
  z-index: 4;

  textarea::placeholder {
    font-size: 15px !important;
    color: #b8c4c2;
    min-height: 200px !important;
    border-color: ${palette.gray.base} !important;
  }
`;

const StyledEmailInput = styled(TextInput)`
  margin-top: 8px;
  border-color: #89989b !important;
  div > input {
    width: 202px;
    height: 30px;
    border-color: ${palette.gray.base} !important;
    ::placeholder {
      font-size: 13px;
      color: #5c6c75;
      height: 40px;
    }
  }
`;
