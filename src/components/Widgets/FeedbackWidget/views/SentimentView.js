import React, { useCallback } from 'react';
import { Layout } from '../components/view-components';
import Emoji from '../components/Emoji';
import styled from '@emotion/styled';
import { uiColors } from '@leafygreen-ui/palette';
import { useFeedbackState } from '../context';
import { theme } from '../../../../theme/docsTheme';

const characterChoices = ['happy', 'upset', 'suggesting'];

const ViewHeader = styled('h3')`
  font-weight: 600;
  font-size: ${theme.fontSize.small};
  text-align: center;
  margin-top: 10px;
  margin-bottom: 16px;
`;

const getCopy = (character) => {
  switch (character) {
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

const optionClicked = ({ character, setSentiment, setView }) => {
  setSentiment(character);
  console.log('setting', character);
  setView('comment');
};

const SentimentOption = ({ character }) => {
  const { setSentiment, setView } = useFeedbackState();
  return (
    <StyledSentiment onClick={() => optionClicked({ character, setSentiment, setView })}>
      <StyledSentimentOption>
        <Emoji character={character} currPage={'sentimentView'} />
        {getCopy(character)}
      </StyledSentimentOption>
    </StyledSentiment>
  );
};

const SentimentView = (props) => {
  return (
    <Layout>
      <ViewHeader>Did this page help?</ViewHeader>
      {characterChoices.map((character) => (
        <SentimentOption character={character} />
      ))}
    </Layout>
  );
};

export default SentimentView;
