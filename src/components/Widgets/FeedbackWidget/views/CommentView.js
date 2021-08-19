import React from 'react';
import { css } from '@emotion/core';
import styled from '@emotion/styled';

import Button from '@leafygreen-ui/button';
import Emoji from '../components/Emoji';
import { Layout, RatingHeader, Footer } from '../components/view-components';
import { useFeedbackState } from '../context';
import { uiColors } from '@leafygreen-ui/palette';
import validateEmail from '../../../../utils/validate-email';
// import ScreenshotButton from '../components/ScreenshotButton';
import Loadable from '@loadable/component';
const ScreenshotButton = Loadable(() => import('../components/ScreenshotButton'));
const sentimentChoices = ['happy', 'upset', 'suggesting'];

function useValidation(inputValue, validator) {
  const [isValid, setIsValid] = React.useState(null);
  React.useEffect(() => {
    setIsValid(validator(inputValue));
  }, [inputValue, validator]);

  return isValid;
}

const CommentHeader = styled('div')`
  display: flex;
`;

const getPlaceHolder = (activeSentiment) => {
  switch (activeSentiment) {
    case 'happy':
      return 'How did this page help you?';
    case 'upset':
      return 'How could this page be more helpful?';
    case 'suggesting':
      return 'What change would you like to see?';
    default:
      return undefined;
  }
};

export default function CommentView({ ...props }) {
  const { feedback, isSupportRequest, submitComment, submitAllFeedback, activeSentiment } = useFeedbackState();
  const { rating } = feedback || { rating: 3 };
  const isPositiveRating = rating > 3;
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
  console.log('hola', sentimentChoices);

  return (
    <Layout>
      <CommentHeader>
        {sentimentChoices.map((sentiment) => (
          <Emoji sentiment={sentiment} currPage={'commentView'} />
        ))}
      </CommentHeader>
      <CommentTextArea
        id="feedback-comment"
        placeholder={getPlaceHolder(activeSentiment)}
        rows={8}
        value={comment}
        onChange={(e) => setComment(e.target.value)}
      />
      <EmailInput
        id="feedback-email"
        placeholder="email@email.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      {hasEmailError && <InputErrorLabel htmlFor="feedback-email">Please enter a valid email address.</InputErrorLabel>}
      <Footer>
        <SubmitButton onClick={() => handleSubmit()}>{isSupportRequest ? 'Continue for Support' : 'Send'}</SubmitButton>
      </Footer>
    </Layout>
  );
}

const SubmitButton = styled(Button)`
  margin-right: -16px;
  margin-bottom: 0px;
`;

const InputStyle = css`
  padding: 14px;
  border: 1px solid ${uiColors.gray.base};
  border-radius: 4px;
  flex-grow: 1;
  line-height: 24px;
  font-size: 16px;
  height: 140px;
  width: 202px;
  margin-bottom: 16px;
  &:focus {
    outline: 0;
    box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.5);
  }
  ::placeholder {
    color: ${uiColors.gray.light1};
  }
`;
const CommentTextArea = styled.textarea`
  ${InputStyle}
  resize: none;
`;
const EmailInput = styled.input`
  ${InputStyle}
  height: 40px!important;
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
