import React from 'react';
import { css } from '@emotion/core';
import styled from '@emotion/styled';
import { useFeedbackState } from '../context';

import Button from '@leafygreen-ui/button';

const NEGATIVE_RATING_HEADING = "We're sorry to hear that.";

export default function CommentView({ ...props }) {
  const { submitSupport } = useFeedbackState();

  return (
    <Layout>
      <Heading>{NEGATIVE_RATING_HEADING}</Heading>
      <Subheading>Please describe your experience with the MongoDB Documentation.</Subheading>
      <Resource>Create a case on the Support Portal</Resource>
      <Resource>MongoDB-User Discussion Forum</Resource>
      <Resource>Stack Overflow</Resource>
      <Resource>DBA StackExchange</Resource>
      <Resource>ServerFault</Resource>
      <Footer>
        <Button onClick={() => submitSupport()}>Send</Button>
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
const Resource = styled.p`
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
  width: calc(100% - 28px);
  margin-bottom: 16px;
  &:focus {
    outline: 0;
    box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.5);
  }
`;
const CommentTextArea = styled.textarea`
  ${InputStyle}
  resize: none;
  min-width: calc(100% - 28px);
  max-width: calc(100% - 28px);
`;
const EmailInput = styled.input`
  ${InputStyle}
`;
