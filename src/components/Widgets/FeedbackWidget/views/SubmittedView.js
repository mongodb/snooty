import React from 'react';
import Button from '@leafygreen-ui/button';
import { css } from '@emotion/react';
import { useFeedbackState } from '../context';
import useScreenSize from '../../../../hooks/useScreenSize';
import { Layout, Heading, Subheading } from '../components/view-components';

export default function SubmittedView() {
  const { abandon } = useFeedbackState();
  const { isMobile } = useScreenSize();
  const { selectedSentiment } = useFeedbackState();
  const finalHeading = selectedSentiment === 'Negative' ? "We're sorry to hear that." : 'Thanks for your help!';
  return (
    <Layout>
      <Heading>{finalHeading}</Heading>
      <Subheading>Your input improves MongoDB's Documentation.</Subheading>
      <Subheading>
        <div>Looking for more resources? </div>
        <a href="https://developer.mongodb.com/community/forums/">MongoDB Community </a>
        <a href="https://www.mongodb.com/developer/">MongoDB Developer Center</a>
        <Subheading></Subheading>
        <SupportCase selectedSentiment={selectedSentiment}>
          {'Have a support contract?'}
          <a href="https://support.mongodb.com/">Create a Support Case</a>
        </SupportCase>
      </Subheading>
      {isMobile && <Button onClick={() => abandon()}>Return to the Documentation</Button>}
    </Layout>
  );
}

const SupportCase = ({ selectedSentiment }) => css`
  display: ${selectedSentiment === 'Negative' ? '' : 'none'};
`;
