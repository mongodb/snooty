import React from 'react';
import Button from '@leafygreen-ui/button';
import { useFeedbackState } from '../context';
import useScreenSize from '../../../../hooks/useScreenSize';
import { Layout, Heading, Subheading } from '../components/view-components';

export default function SubmittedView(props) {
  const { abandon } = useFeedbackState();
  const { isMobile } = useScreenSize();
  return (
    <Layout>
      <Heading>We appreciate your feedback.</Heading>
      <Subheading>We're working hard to improve the MongoDB Documentation.</Subheading>
      <Subheading>
        <span>For additional support, explore the </span>
        <a href="https://developer.mongodb.com/community/forums/">MongoDB discussion forum.</a>
      </Subheading>
      {isMobile && <Button onClick={() => abandon()}>Return to the Documentation</Button>}
    </Layout>
  );
}
