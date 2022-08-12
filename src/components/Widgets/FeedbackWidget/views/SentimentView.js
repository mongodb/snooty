import React from 'react';
import styled from '@emotion/styled';
import { palette } from '@leafygreen-ui/palette';
import { Layout } from '../components/view-components';
import { theme } from '../../../../theme/docsTheme';
import { useFeedbackState } from '../context';
import Emoji from '../components/Emoji';

export const sentimentChoices = [
  { sentiment: 'Positive', copy: 'Yes, it did!', category: 'Helpful' },
  { sentiment: 'Negative', copy: 'No, I have feedback.', category: 'Unhelpful' },
  { sentiment: 'Suggestion', copy: 'I have a suggestion.', category: 'Idea' },
];

const ViewHeader = styled('h3')`
  font-weight: 600;
  font-size: ${theme.fontSize.default};
  text-align: center;
  margin-left: -10px;
  margin-top: 8px;
  margin-bottom: 32px;
  display: flex;
  align-items: flex-end;
`;

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
  padding: 13px 32px !important;
  padding-top: 16px !important;
  padding-bottom: 16px !important;
  cursor: pointer;
  :hover {
    background-color: ${palette.gray.light2};
  }
`;

//first view of the FW
const SentimentView = () => {
  return (
    <Layout>
      <ViewHeader>Did this page help?</ViewHeader>
      {sentimentChoices.map((path) => (
        <SentimentOption path={path} />
      ))}
    </Layout>
  );
};

//each of the three sentiment categories can be selected
//emoji and corresponding text
const SentimentOption = ({ path }) => {
  const { setSentiment } = useFeedbackState();
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
