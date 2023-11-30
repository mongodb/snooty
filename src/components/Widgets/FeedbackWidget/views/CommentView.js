import React, { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import TextArea from '@leafygreen-ui/text-area';
import TextInput from '@leafygreen-ui/text-input';
import Button from '@leafygreen-ui/button';
import { palette } from '@leafygreen-ui/palette';
import Loadable from '@loadable/component';
import { Layout } from '../components/view-components';
import { useFeedbackContext } from '../context';
import { retrieveDataUri } from '../handleScreenshot';
import useViewport from '../../../../hooks/useViewport';
import { useSiteMetadata } from '../../../../hooks/use-site-metadata';
import useScreenSize from '../../../../hooks/useScreenSize';
import validateEmail from '../../../../utils/validate-email';
import StarRating from '../components/StarRating';
const ScreenshotButton = Loadable(() => import('../components/ScreenshotButton'));

const SubmitButton = styled(Button)`
  display: block;
  margin-top: 24px;
  margin-left: auto;
  height: 28px !important;
  width: 55px;

  :focus {
    box-shadow: 0px 1px 2px rgba(6, 22, 33, 0.3);
  }
`;

const StyledCommentInput = styled(TextArea)`
  font-size: 13px;
  height: 140px;
  width: 100%;
  z-index: 4;

  textarea {
    height: 140px;
  }

  textarea::placeholder {
    color: ${palette.gray.dark1};
    line-height: 20px;
    min-height: 200px !important;
    border-color: ${palette.gray.base} !important;
  }
`;

const StyledEmailInput = styled(TextInput)`
  margin: 8px 0;
  min-height: 36px;
  font-size: 13px;
  border-color: #89989b !important;
  width: 100%;

  ::optional {
    font-size: 300px;
  }

  div > input {
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
    font-family: 'Euclid Circular A', 'Helvetica Neue', Helvetica, Arial, sans-serif !important;
    color: #b8c4c2;
  }
`;

const StyledStarRating = styled(StarRating)`
  margin: 30px 0 16px;
`;

const useValidation = (inputValue, validator) => {
  const [isValid, setIsValid] = useState(null);
  useEffect(() => {
    setIsValid(validator(inputValue));
  }, [inputValue, validator]);

  return isValid;
};

const CommentView = () => {
  const { submitAllFeedback, screenshotTaken, setSelectedRating } = useFeedbackContext();
  const placeholderText = 'Tell us more about your experience';

  const [comment, setComment] = useState('');
  const [email, setEmail] = useState('');
  const [hasEmailError, setHasEmailError] = useState(false);
  const isValidEmail = useValidation(email, validateEmail);
  const { snootyEnv } = useSiteMetadata();
  const viewport = useViewport();
  const { isMobile } = useScreenSize();

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
      <StyledStarRating handleRatingSelection={setSelectedRating} starSize={28} />
      <StyledCommentInput
        type="text"
        id="feedback-comment"
        aria-labelledby="Comment Text Box"
        placeholder={placeholderText}
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        baseFontSize={13}
      />
      <StyledEmailInput
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
      {!isMobile && <ScreenshotButton />}
      <SubmitButton onClick={() => handleSubmit()} type="submit">
        {'Send'}
      </SubmitButton>
    </Layout>
  );
};

export default CommentView;
