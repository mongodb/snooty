import React from 'react';
import styled from '@emotion/styled';
import Button from '@leafygreen-ui/button';
import { Body } from '@leafygreen-ui/typography';
import { useFeedbackState } from '../context';
import { Layout, CommentHeader, Footer } from '../components/view-components';

export default function SupportView(props) {
  const { submitSupport } = useFeedbackState();

  return (
    <Layout>
      <CommentHeader isPositive={false} subheadingText={"We're sorry to hear that"} />
      <Body>{"Your input improves MongoDB's documentation."}</Body>
      <Body>{'To learn more about MondoDB:'}</Body>
      <Body>{'Looking for more help?'}</Body>
      <Resource link="https://developer.mongodb.com/community">Visit the MongoDB Community</Resource>
      <Body>{'Have a support contract?'}</Body>
      <Resource link="https://support.mongodb.com/">Create a Support Case</Resource>
      <Footer>
        <Button onClick={() => submitSupport()}>Send</Button>
      </Footer>
    </Layout>
  );
}

const ResourceLayout = styled.div`
  padding-bottom: 16px;
  width: 100%;
  text-align: left;
  font-weight: normal;
`;
function Resource({ link = '', children, ...props }) {
  return (
    <ResourceLayout>
      <a href={link} target="__blank">
        {children}
      </a>
    </ResourceLayout>
  );
}
