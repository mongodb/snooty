import React, { useState, useEffect } from 'react';
import { cx, css as LeafyCSS } from '@leafygreen-ui/emotion';
import styled from '@emotion/styled';
import TextArea from '@leafygreen-ui/text-area';
import TextInput from '@leafygreen-ui/text-input';
import Button from '@leafygreen-ui/button';
import { palette } from '@leafygreen-ui/palette';
import Loadable from '@loadable/component';
import { Layout, CommentHeader, Footer } from '../components/view-components';
import { useFeedbackContext } from '../context';
import { retrieveDataUri } from '../handleScreenshot';
import useViewport from '../../../../hooks/useViewport';
import { useSiteMetadata } from '../../../../hooks/use-site-metadata';
import useScreenSize from '../../../../hooks/useScreenSize';
import validateEmail from '../../../../utils/validate-email';
const ScreenshotButton = Loadable(() => import('../components/ScreenshotButton'));

const FooterMargin = ({ hasEmailError }) => LeafyCSS`
  margin-bottom: ${hasEmailError ? '0px' : '32px'} !important;
`;

const SubmitButton = styled(Button)`
  height: 28px !important;
  width: 55px;
  :focus {
    box-shadow: 0px 1px 2px rgba(6, 22, 33, 0.3);
  }
`;

const StyledCommentInput = styled(TextArea)`
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
    height: 30px;
    ::placeholder {
      color: #b8c4c2;
      height: 40px;
    }
    // padding within the text input
    padding-left: 8px !important;
    padding-right: ${({ state }) => (state === 'error' ? '34px' : '65px')} !important;
  }

  // optional text styling
  div > div {
    font-family: 'Euclid Circular A', Akzidenz, 'Helvetica Neue', Helvetica, Arial, sans-serif !important;
    color: #b8c4c2;
  }
`;

// responsive width for mobile view
const widthStyling = (isMobile, currWindowWidth) => LeafyCSS`
  width: ${isMobile ? Math.max(currWindowWidth - 32, 280) : '202'}px !important;
`;

const useValidation = (inputValue, validator) => {
  const [isValid, setIsValid] = useState(null);
  useEffect(() => {
    setIsValid(validator(inputValue));
  }, [inputValue, validator]);

  return isValid;
};

const CommentView = () => {
  const { selectedSentiment, submitAllFeedback, screenshotTaken } = useFeedbackContext();
  const placeholderText =
    selectedSentiment === 'Positive'
      ? 'How did this page help you?'
      : selectedSentiment === 'Negative'
      ? 'How could this page be more helpful?'
      : 'What change would you like to see?';

  const [comment, setComment] = useState('');
  const [email, setEmail] = useState('');
  const [hasEmailError, setHasEmailError] = useState(false);
  const isValidEmail = useValidation(email, validateEmail);
  const { snootyEnv } = useSiteMetadata();
  const viewport = useViewport();
  const { isMobile } = useScreenSize();
  const currWindowWidth = window.innerWidth;

  const handleSubmit = async () => {
    if (isValidEmail) {
      if (screenshotTaken) {
        const dataUri = await retrieveDataUri();
        await submitAllFeedback({ comment, email, snootyEnv, dataUri, viewport });
      } else {
        await submitAllFeedback({ comment, email, snootyEnv });
      }
    } else {
      setHasEmailError(true);
    }
  };

  return (
    <Layout>
      <CommentHeader />
      <StyledCommentInput
        className={cx(widthStyling(isMobile, currWindowWidth))}
        type="text"
        id="feedback-comment"
        aria-labelledby="Comment Text Box"
        placeholder={placeholderText}
        value={comment}
        rows={4}
        onChange={(e) => setComment(e.target.value)}
      />
      <StyledEmailInput
        className={cx(FooterMargin({ hasEmailError }), widthStyling(isMobile, currWindowWidth))}
        type="email"
        id="feedback-email"
        aria-labelledby="Email Text Box"
        placeholder="Email Address"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        errorMessage="Please enter a valid email."
        state={hasEmailError ? 'error' : 'none'}
        optional={true}
      />
      <Footer className={cx(widthStyling(isMobile, currWindowWidth))}>
        <SubmitButton onClick={() => handleSubmit()} type="submit">
          {'Send'}
        </SubmitButton>
        {!isMobile && <ScreenshotButton />}
      </Footer>
    </Layout>
  );
};

export default CommentView;
