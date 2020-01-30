import React from 'react';
import styled from '@emotion/styled';
import Button from '@leafygreen-ui/button';
import { useFeedbackState } from '../context';
import { Layout, RatingHeader, Footer } from '../components/view-components';

export default function CommentView(props) {
  const { submitSupport } = useFeedbackState();

  return (
    <Layout>
      <RatingHeader isPositive={false} noSubheading />
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
