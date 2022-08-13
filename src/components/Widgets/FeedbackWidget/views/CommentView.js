import React, { useState, useEffect } from 'react';
import { css } from '@emotion/react';
import { cx, css as LeafyCSS } from '@leafygreen-ui/emotion';
import styled from '@emotion/styled';
import TextArea from '@leafygreen-ui/text-area';
import TextInput from '@leafygreen-ui/text-input';
import button from '@leafygreen-ui/button';
import { palette } from '@leafygreen-ui/palette';
import Loadable from '@loadable/component';
import { Layout, CommentHeader, Footer } from '../components/view-components';
import { useFeedbackState } from '../context';
import { retrieveDataUri } from '../handleScreenshot';
import useViewport from '../../../../hooks/useViewport';
import { useSiteMetadata } from '../../../../hooks/use-site-metadata';
import validateEmail from '../../../../utils/validate-email';
const ScreenshotButton = Loadable(() => import('../components/ScreenshotButton'));

function useValidation(inputValue, validator) {
  const [isValid, setIsValid] = useState(null);
  useEffect(() => {
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
  const { snootyEnv, publishedBranch } = useSiteMetadata();

  const borderColor = ({ hasEmailError }) => LeafyCSS`
   div > input {
     border-color: ${hasEmailError ? palette.red.base : palette.gray.base} !important;
  }
  `;
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
        placeholder={placeholderText}
        value={comment}
        rows={4}
        onChange={(e) => setComment(e.target.value)}
        aria-labelledby="Text box for user comments"
      />
      <StyledEmailInput
        id="feedback-email"
        placeholder="Email Address"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        type={'email'}
        className={cx(borderColor({ hasEmailError }))}
        aria-labelledby="text input for user emails"
        errorMessage="LG error message doesn't render, this is a placeholder"
      />
      <EmailElement>
        <OptionalText hasEmailError={hasEmailError}>{'Optional'}</OptionalText>
        <ErrorDisplay hasEmailError={hasEmailError}>
          <ErrorIcon src={withPrefix('assets/erroricon.svg')} />
        </ErrorDisplay>
      </EmailElement>
      <InputErrorLabel hasEmailError={hasEmailError} htmlFor="feedback-email">
        Please enter a valid email.
      </InputErrorLabel>
      <Footer>
        <SubmitButton onClick={() => handleSubmit()} className={cx(SubmitButtonMargin({ hasEmailError }))}>
          {'Send'}
        </SubmitButton>
        <ScreenshotButton />
      </Footer>
    </Layout>
  );
}

const ErrorIcon = styled.img``;

const ErrorDisplay = styled.span(
  ({ hasEmailError }) => css`
    display: ${hasEmailError ? '' : 'none'};
    margin-left: 30px;
  `
);

const OptionalText = styled.div(
  ({ hasEmailError }) => css`
    display: ${hasEmailError ? 'none' : ''};
    font-family: 'Akzidenz-Grotesk Std';
    font-style: italic;
    font-weight: 300;
    font-size: 13px;
    line-height: 20px;
    margin-top: 3px;
  `
);

const EmailElement = styled.div`
  width: 44px;
  height: 20px;
  font-family: 'Akzidenz-Grotesk Std';
  font-style: italic;
  font-weight: 300;
  font-size: 13px;
  /* identical to box height, or 167% */
  margin-top: -28px;
  margin-left: 130px !important;
  margin-bottom: 5px;
  z-index: 10 !important;
`;

const SubmitButtonMargin = ({ hasEmailError }) => LeafyCSS`
margin-top: ${hasEmailError ? '2px' : '24px'} !important;
transition: 0ms;
`;
/** 
font-weight: 399;
  font-family: 'Akzidenz-Grotesk Std';
  font-style: normal;

  background: #f9fbfa;
  text-align: center;
  font-size: ${theme.fontSize.default};
  justify-content: center;
  align-items: center;
  padding: 1px 12px 3px;
  box-shadow: 0px 1px 2px rgba(6, 22, 33, 0.3);
  gap: 6px;
  border-radius: 4px;

  */
const SubmitButton = styled(button)`
  margin-right: -8px !important;
  height: 28px !important;
  width: 55px;
  :focus {
    box-shadow: 0px 1px 2px rgba(6, 22, 33, 0.3);
  }
`;

const InputErrorLabel = styled.label(
  ({ hasEmailError }) => css`
    display: ${hasEmailError ? '' : 'none'};
    color: red;
    text-align: center;
    margin-left: -40px;
    font-size: 13px;
    margin-bottom: -5px;
  `
);

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
    padding-right: 60px;
    height: 30px;
    ::placeholder {
      font-size: 13px;
      color: #5c6c75;
      height: 40px;
    }
  }
`;
