import React from 'react';
import styled from '@emotion/styled';
import { uiColors } from '@leafygreen-ui/palette';
import { Layout } from '../components/view-components';
import { theme } from '../../../../theme/docsTheme';
import { useFeedbackState } from '../context';
import Emoji from '../components/Emoji';

export const sentimentChoices = [
  { sentiment: 'Positive', copy: 'Yes, it did!', category: 'Helpful' },
  { sentiment: 'Negative', copy: 'No, I have feedback', category: 'Unhelpful' },
  { sentiment: 'Suggestion', copy: 'I have a suggestion', category: 'Idea' },
];

const ViewHeader = styled('h3')`
  font-weight: 600;
  font-size: ${theme.fontSize.default};
  text-align: center;
  margin-left: -15px;
  margin-top: 15px;
  margin-bottom: 16px;
  positiion: absolute;
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
  color: ${uiColors.gray.dark1} !important;
  margin: 0px -37px !important;
  padding: 13px 32px !important;
  cursor: pointer;
  :hover {
    background-color: rgba(0, 0, 0, 0.1);
  }
`;

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
