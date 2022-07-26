import React from 'react';
import styled from '@emotion/styled';
import { uiColors } from '@leafygreen-ui/palette';
import { Layout } from '../components/view-components';
import { theme } from '../../../../theme/docsTheme';
import { useFeedbackState } from '../context';
import Emoji from '../components/Emoji';

export const sentimentChoices = ['positive', 'negative', 'suggestion'];

const getCopy = (sentiment) => {
  switch (sentiment) {
    case 'positive':
      return 'Yes, it did!';
    case 'negative':
      return 'No, I have feedback.';
    case 'suggestion':
      return 'I have a suggestion.';
    default:
      return '';
  }
};

const ViewHeader = styled('h3')`
  font-weight: 600;
  font-size: 16px;
  text-align: center;
  margin-left: -15px;
  margin-top: 15px;
  margin-bottom: 16px;
`;

const StyledSentiment = styled('div')`
  width: 87%;
`;

const StyledSentimentOption = styled('h4')`
  font-weight: 400 !important;
  font-size: ${theme.fontSize.default} !important;
  text-align: left;
  color: ${uiColors.gray.dark1} !important;
  margin: 0px -37px !important;
  padding: 13px 32px !important;
  cursor: pointer;
  :hover {
    background-color: rgba(0, 0, 0, 0.1);
  }
`;

const SentimentView = (props) => {
  return (
    <Layout>
      <ViewHeader>Did this page help?</ViewHeader>
      {sentimentChoices.map((sentiment) => (
        <SentimentOption sentiment={sentiment} />
      ))}
    </Layout>
  );
};

const SentimentOption = ({ sentiment, onClick }) => {
  const { setSentiment } = useFeedbackState();
  return (
    <StyledSentiment>
      <StyledSentimentOption onClick={() => setSentiment(sentiment)}>
        <Emoji sentiment={sentiment} />
        {getCopy(sentiment)}
      </StyledSentimentOption>
    </StyledSentiment>
  );
};

export default SentimentView;
