import React from 'react';
import Button from '@leafygreen-ui/button';
import styled from '@emotion/styled';
import { useFeedbackContext } from '../context';
import useScreenSize from '../../../../hooks/useScreenSize';
import { Layout, Heading, Subheading } from '../components/view-components';

const SupportCase = styled.div`
  margin-top: 16px;
`;

const StyledHeading = styled.div`
  margin-top: 8px !important;
  margin-bottom: 16px !important;
  margin-left: -5px;
`;

const SubmittedView = () => {
  const { abandon } = useFeedbackContext();
  const { isMobile } = useScreenSize();
  const { selectedSentiment } = useFeedbackContext();
  const isSentimentNegative = selectedSentiment === 'Negative';
  const finalHeading = isSentimentNegative ? "We're sorry to hear that." : 'Thanks for your help!';

  return (
    <Layout>
      <StyledHeading>
        <Heading>{finalHeading}</Heading>
      </StyledHeading>
      <Subheading>Your input improves MongoDB's Documentation.</Subheading>
      <Subheading>
        <span>Looking for more resources? </span>
        <a href="https://developer.mongodb.com/community/forums/">MongoDB Community </a>
        <a href="https://www.mongodb.com/developer/">MongoDB Developer Center</a>
        {isSentimentNegative && (
          <SupportCase selectedSentiment={selectedSentiment}>
            {'Have a support contract?'}
            <a href="https://support.mongodb.com/">Create a Support Case</a>
          </SupportCase>
        )}
      </Subheading>
      {isMobile && <Button onClick={() => abandon()}>Return to the Documentation</Button>}
    </Layout>
  );
};

export default SubmittedView;
