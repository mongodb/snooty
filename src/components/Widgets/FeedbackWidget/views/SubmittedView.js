import React from 'react';
import Button from '@leafygreen-ui/button';
import { useFeedbackState } from '../context';
import useScreenSize from '../../../../hooks/useScreenSize';
import { Layout, Heading, Subheading } from '../components/view-components';

export default function SubmittedView() {
  const { abandon } = useFeedbackState();
  const { isMobile } = useScreenSize();
  const { selectedSentiment } = useFeedbackState();
  if (selectedSentiment === 'negative') {
    return (
      <Layout>
        <Heading>{"We're sorry to hear that."}</Heading>
        <Subheading>Your input improves MongoDB's Documentation.</Subheading>
        <Subheading>
          <div>Looking for more help? </div>
          <a href="https://developer.mongodb.com/community/forums/">Visit the MongoDB Community</a>
          <Subheading></Subheading>
          <div>Have a support contract?</div>
          <a href="https://support.mongodb.com/">Create a Support Case</a>
        </Subheading>
        {isMobile && <Button onClick={() => abandon()}>Return to the Documentation</Button>}
      </Layout>
    );
  } else {
    return (
      <Layout>
        <Heading>{'Thanks for your help!'}</Heading>
        <Subheading>Your input improves MongoDB's Documentation.</Subheading>
        <Subheading>
          <div>To learn more about MongoDB: </div>
          <a href="https://university.mongodb.com/">Visit MongoDB University</a>
          <div>
            <a href="https://developer.mongodb.com/community/forums/">Visit the MongoDB Community</a>
          </div>
        </Subheading>
        {isMobile && <Button onClick={() => abandon()}>Return to the Documentation</Button>}
      </Layout>
    );
  }
}
