import React from 'react';
import styled from '@emotion/styled';
import Button from '@leafygreen-ui/button';
import { useFeedbackState } from '../context';
import usePageSize from '../../../hooks/usePageSize';
import { Layout, Heading, Subheading } from '../components/view-components';

export default function SubmittedView(props) {
  const { abandon } = useFeedbackState();
  const { isSmallScreen } = usePageSize();
  return (
    <Layout>
      <Heading>We appreciate your feedback.</Heading>
      <Subheading>We're working hard to improve.</Subheading>
      <p>
        <span>For additional support, explore the </span>
        <a href="https://groups.google.com/forum/#!forum/mongodb-user">MongoDB discussion forum.</a>
      </p>
      {isSmallScreen && <Button onClick={() => abandon()}>Return to the Documentation</Button>}
    </Layout>
  );
}
