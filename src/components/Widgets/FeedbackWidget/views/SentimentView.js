import React, { useCallback } from 'react';
import { Layout } from '../components/view-components';
import Emoji from '../components/Emoji';
import styled from '@emotion/styled';
import { uiColors } from '@leafygreen-ui/palette';
import { useFeedbackState } from '../context';
import { theme } from '../../../../theme/docsTheme';

const sentimentChoices = ['happy', 'upset', 'suggesting'];

const ViewHeader = styled('h3')`
  font-weight: 600;
  font-size: ${theme.fontSize.small};
  text-align: center;
  margin-top: 10px;
  margin-bottom: 16px;
`;

const getCopy = (sentiment) => {
  switch (sentiment) {
    case 'happy':
      return 'Yes, it did!';
    case 'upset':
      return 'No, I have feedback.';
    case 'suggesting':
      return 'I have a suggestion.';
    default:
      return '';
  }
};

const StyledSentiment = styled('div')`
  width: 100%;
`;
const StyledSentimentOption = styled('h4')`
  font-weight: 200 !important;
  color: ${uiColors.gray.dark1} !important;
  margin: 0px -32px !important;
  padding: 8px 32px !important;
  cursor: pointer;
  :hover {
    background-color: rgba(0, 0, 0, 0.1);
  }
`;

const optionClicked = ({ sentiment, setActiveSentiment, setView }) => {
  setActiveSentiment(sentiment);
  setView('comment');
};

const SentimentOption = ({ sentiment }) => {
  const { setActiveSentiment, setView } = useFeedbackState();
  return (
    <StyledSentiment onClick={() => optionClicked({ sentiment, setActiveSentiment, setView })}>
      <StyledSentimentOption>
        <Emoji sentiment={sentiment} currPage={'sentimentView'} />
        {getCopy(sentiment)}
      </StyledSentimentOption>
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
