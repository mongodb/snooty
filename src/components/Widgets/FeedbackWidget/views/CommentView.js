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
    selectedSentiment === 'positive'
      ? 'How did this page help you?'
      : selectedSentiment === 'negative'
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
        placeholder={placeholderText}
        value={comment}
        onChange={(e) => setComment(e.target.value)}
      ></StyledCommentInput>
      <StyledEmailInput
        id="feedback-email"
        placeholder="email@email.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        type={'email'}
      ></StyledEmailInput>
      <OptionalText>{'Optional'}</OptionalText>
      {hasEmailError && <InputErrorLabel htmlFor="feedback-email">Please enter a valid email address.</InputErrorLabel>}
      <Footer>
        <SubmitButton onClick={() => handleSubmit()}>{'Send'}</SubmitButton>
      </Footer>
    </Layout>
  );
}

const OptionalText = styled.span`
  width: 44px;
  height: 20px;
  font-family: 'Akzidenz-Grotesk Std';
  font-style: italic;
  font-weight: 300;
  font-size: 13px;
  line-height: 20px;
  /* identical to box height, or 167% */
  color: #5d6c74;
  margin-top: -30px !important;
  margin-left: 130px !important;
  margin-bottom: 5px;
  z-index: 5;
  background: #ffffff;
`;

const SubmitButton = styled(Button)`
  margin-top: 13px !important;
  margin-bottom: 16px;
  margin-right: -8px !important;
  height: 28px !important;
  width: 61px;
  box-shadow: 0px 1px 2px rgba(6, 22, 33, 0.3);
  :focus {
    box-shadow: 0px 1px 2px rgba(6, 22, 33, 0.3);
  }
  tex-align: center;
  font-size: 16px;
  font-weight: 399;
  font-family: 'Akzidenz-Grotesk Std';
  font-style: normal;

  background: #f9fbfa;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 1px 12px 3px;
  gap: 6px;
  border-radius: 4px;
`;

/**
const InputStyle = css`
  padding: 14px;
  border: 0.5px solid ${uiColors.black.base};
  border-radius: 2px;
  flex-grow: 3;
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
`;
const EmailInput = styled.input`
  ${InputStyle}
`;
*/
const InputLabel = styled.label`
  width: 100%;
  text-align: left;
`;
const InputErrorLabel = styled(InputLabel)`
  color: red;
  margin-top: -16px;
  margin-bottom: 16px;
`;

const StyledCommentInput = styled(TextArea)`
  width: 202px;
  margin-top: -16px;
  textarea::placeholder {
    font-size: 15px !important; 
    line-height: 24px;
    color: #B8C4C2;
  }
  textarea:active {
    border-color: ${uiColors.gray.base} !important;
   }
  /* Remove blue border on focus , shadow on hover*/
  textarea::height{
    140px;
  }


`;

const StyledEmailInput = styled(TextInput)`
  margin-top: 16px;
  div > input {
    sizevariant: 'large';
    width: 202px;
    height: 40px;
    box-shadow: none !important;
    border-color: ${uiColors.gray.base};
    ::placeholder {
      font-size: 16px;
      color: #b8c4c2;
    }
  }
`;
