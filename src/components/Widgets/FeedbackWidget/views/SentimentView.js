import React from 'react';
import { Layout } from '../components/view-components';
import styled from '@emotion/styled';
import { theme } from '../../../../theme/docsTheme';
// import { useFeedbackState } from '../context';
import { uiColors } from '@leafygreen-ui/palette';

const sentimentChoices = ['positive', 'negative', 'suggestion'];

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
  font-size: 15px;
  text-align: center;
  margin-top: 10px;
  margin-bottom: 16px;
`;

const StyledSentiment = styled('div')`
  width: 95%;
`;

const StyledSentimentOption = styled('h4')`
  font-weight: 400 !important;
  font-size: ${theme.fontSize.default} !important;
  text-align: left;
  color: ${uiColors.gray.dark1} !important;
  margin: 0px -32px !important;
  padding: 8px 32px !important;
  cursor: pointer;
  :hover {
    background-color: rgba(0, 0, 0, 0.1);
  }
`;
const SentimentOption = ({ sentiment }) => {
  return (
    <StyledSentiment>
      <StyledSentimentOption>{getCopy(sentiment)}</StyledSentimentOption>
    </StyledSentiment>
  );
};

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

export default SentimentView;
