import React from 'react';
import { css } from '@emotion/core';
import styled from '@emotion/styled';
import { useFeedbackState } from '../context';

import Button from '@leafygreen-ui/button';

const NEGATIVE_RATING_HEADING = "We're sorry to hear that.";
const POSITIVE_RATING_HEADING = "We're glad to hear that!";

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
      <Heading>{isPositiveRating ? POSITIVE_RATING_HEADING : NEGATIVE_RATING_HEADING}</Heading>
      <Subheading>Please describe your experience with the MongoDB Documentation.</Subheading>
      <CommentTextArea
        rows={8}
        placeholder="Tell us more."
        value={comment}
        onChange={e => setComment(e.target.value)}
      />
      <EmailInput placeholder="Email Address (optional)" value={email} onChange={e => setEmail(e.target.value)} />
      <Footer>
        <Button onClick={() => handleSubmitComment()}>{isSupportRequest ? 'Continue for Support' : 'Send'}</Button>
      </Footer>
    </Layout>
  );
}
const Layout = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;
const Heading = styled.h2`
  margin-top: 0;
  width: 100%;
  text-align: left;
  font-weight: normal;
`;
const Footer = styled.div`
  margin-top: 0;
  width: 100%;
  text-align: right;
  font-weight: normal;
`;
const Subheading = styled.p`
  margin-top: 0;
  width: 100%;
  text-align: left;
  font-weight: normal;
`;

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
