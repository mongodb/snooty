import React from 'react';
import styled from '@emotion/styled';
import { palette } from '@leafygreen-ui/palette';
import { Layout } from '../components/view-components';
import { theme } from '../../../../theme/docsTheme';
import { useFeedbackContext } from '../context';
import useScreenSize from '../../../../hooks/useScreenSize';
import Emoji from '../components/Emoji';
import ViewHeader from '../components/ViewHeader';

export const sentimentChoices = [
  { sentiment: 'Positive', copy: 'Yes, it did!', category: 'Helpful' },
  { sentiment: 'Negative', copy: 'No, I have feedback.', category: 'Unhelpful' },
  { sentiment: 'Suggestion', copy: 'I have a suggestion.', category: 'Idea' },
];

const StyledSentiment = styled.div`
  width: 100%;
`;

const StyledSentimentOption = styled.h4(
  (props) => `
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
  margin: 0px ${props.isMobile ? '-56px' : '-25px'} !important;
  margin-bottom: 8px;
  padding: 16px ${props.isMobile ? '56px' : '23px'} !important;
  cursor: pointer;
  :hover {
    background-color: ${palette.gray.light2};
  }
`
);

const SentimentOption = ({ path }) => {
  const { setSentiment } = useFeedbackContext();
  const { isMobile } = useScreenSize();

  return (
    <StyledSentiment>
      <StyledSentimentOption isMobile={isMobile} onClick={() => setSentiment(path.sentiment)}>
        <Emoji sentiment={path.sentiment} />
        {path.copy}
      </StyledSentimentOption>
    </StyledSentiment>
  );
};

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

export default SentimentView;
