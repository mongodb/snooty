import React from 'react';
import { Layout } from '../components/view-components';
import Emoji from '../components/Emoji';
import styled from '@emotion/styled';
import { uiColors } from '@leafygreen-ui/palette';
import { useFeedbackState } from '../context';

const sentimentChoices = ['happy', 'upset', 'suggesting']

const ViewHeader = styled('h3')`
  font-weight: 600;
  font-size: 14px;
  text-align: center;
  margin-top: 10px;
  margin-bottom: 10px;
`;

const getCopy = (sentiment) => {
  switch(sentiment){
    case 'happy':
      return 'Yes, it did';
    case 'upset':
      return 'No, I have feedback.'
    case 'suggesting':
      return 'I have a suggestion.'
    default:
      return 'noemoji';
  }
}

const StyledSentiment = styled('div')`
  width: 100%;
`;
const StyledSentimentOption = styled('h4')`
  font-weight: 200!important;
  font-size: 16px!important;
  color: ${uiColors.gray.dark1}!important;
  margin:0px -24px !important;
  padding: 10px 24px!important;
  cursor: pointer;
  :hover{
    background-color: rgba(0, 0, 0, 0.1);
  }
`;

const SentimentOption = ({sentiment}) => {
  const { feedback, setSentiment } = useFeedbackState();
  return (
    <StyledSentiment onClick={() => setSentiment()}>
      <StyledSentimentOption>
        <Emoji sentiment={sentiment}/>
        {getCopy(sentiment)}
      </StyledSentimentOption>
    </StyledSentiment>
  )
}

const SentimentView = (props)  => {
  return (
    <Layout>
      <ViewHeader>Did this page help?</ViewHeader>
      {sentimentChoices.map((sentiment) => (
        <SentimentOption sentiment={sentiment}/>
      ))}
    </Layout>
  );
}

export default SentimentView;