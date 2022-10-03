import React from 'react';
import styled from '@emotion/styled';
import { palette } from '@leafygreen-ui/palette';
import { Layout } from '../components/view-components';
import { theme } from '../../../../theme/docsTheme';
import { useFeedbackContext } from '../context';
import Emoji from '../components/Emoji';
import ViewHeader from '../components/ViewHeader';

export const sentimentChoices = [
  { sentiment: 'Positive', copy: 'Yes, it did!', category: 'Helpful' },
  { sentiment: 'Negative', copy: 'No, I have feedback.', category: 'Unhelpful' },
  { sentiment: 'Suggestion', copy: 'I have a suggestion.', category: 'Idea' },
];

const StyledSentiment = styled('div')`
  width: 87%;
`;

const StyledSentimentOption = styled('h4')`
  font-weight: 400 !important;
  font-size: ${theme.fontSize.default} !important;
  line-height: 24px;
  align-items: center;
  display: flex;
  flex: none;
  order: 1;
  align-self: stretch;
  text-align: left;
  color: ${palette.gray.dark1} !important;
  margin: 0px -37px !important;
  margin-bottom: 8px;
  padding: 13px 32px !important;
  padding-top: 16px !important;
  padding-bottom: 16px !important;
  cursor: pointer;
  :hover {
    background-color: ${palette.gray.light2};
  }
`;

const SentimentView = () => {
  return (
    <Layout>
      <ViewHeader />
      {sentimentChoices.map((path) => (
        <SentimentOption path={path} key={path.sentiment} />
      ))}
    </Layout>
  );
};

//each of the three sentiment categories can be selected
//emoji and corresponding text
const SentimentOption = ({ path }) => {
  const { setSentiment } = useFeedbackContext();
  return (
    <StyledSentiment>
      <StyledSentimentOption onClick={() => setSentiment(path.sentiment)}>
        <Emoji sentiment={path.sentiment} />
        {path.copy}
      </StyledSentimentOption>
    </StyledSentiment>
  );
};

export default SentimentView;
