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
  const { snootyEnv } = useSiteMetadata();

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
        aria-labelledby="text input for user emails"
        errorMessage="Please enter a valid email"
        state={hasEmailError ? 'error' : 'none'}
        optional="true"
        className={cx(FooterMargin({ hasEmailError }))}
      />
      <Footer>
        <SubmitButton onClick={() => handleSubmit()}>{'Send'}</SubmitButton>
        <ScreenshotButton />
      </Footer>
    </Layout>
  );
}

const FooterMargin = ({ hasEmailError }) => LeafyCSS`
  margin-bottom: ${hasEmailError ? '0px' : '32px'} !important;
`;

const SubmitButton = styled(button)`
  margin-right: -8px !important;
  height: 28px !important;
  width: 55px;
  :focus {
    box-shadow: 0px 1px 2px rgba(6, 22, 33, 0.3);
  }
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
  font-size: 13px;
  border-color: #89989b !important;
  ::optional {
    font-size: 300px;
  }
  div > input {
    width: 202px;
    padding-right: 60px;
    height: 30px;
    ::placeholder {
      color: #5c6c75;
      height: 40px;
      }
    }
  div > div {
    font-family: 'Euclid Circular A' !important;
    margin-bottom: -5px;
  }
  }
`;
