import React from 'react';
import { css } from '@emotion/core';
import styled from '@emotion/styled';

import Button from '@leafygreen-ui/button';
import { Layout, RatingHeader, Footer } from '../components/view-components';

import { useFeedbackState } from '../context';
import Loadable from '@loadable/component';
const ScreenshotButton = Loadable(() => import('../components/ScreenshotButton'));

export default function CommentView({ ...props }) {
  const { feedback, isSupportRequest, submitComment } = useFeedbackState();
  const { rating } = feedback || { rating: 3 };
  const isPositiveRating = rating > 3;

  const [comment, setComment] = React.useState('');
  const [email, setEmail] = React.useState('');
  const handleSubmitComment = () => {
    submitComment({ comment, email });
  };

  return (
    <Layout>
      <RatingHeader isPositive={isPositiveRating} />
      <CommentTextArea
        rows={8}
        placeholder="Describe your experience."
        value={comment}
        onChange={e => setComment(e.target.value)}
      />
      <EmailInput placeholder="Email Address (optional)" value={email} onChange={e => setEmail(e.target.value)} />
      <Footer>
        <Button onClick={() => handleSubmitComment()}>{isSupportRequest ? 'Continue for Support' : 'Send'}</Button>
        <ScreenshotButton />
      </Footer>
    </Layout>
  );
}

const InputStyle = css`
  padding: 14px;
  border: 1px solid gray;
  border-radius: 4px;
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
