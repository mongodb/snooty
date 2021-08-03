import React from 'react';
import { Layout, Heading } from '../components/view-components';
import StarRating from '../components/StarRating';
import styled from '@emotion/styled';
import { uiColors } from '@leafygreen-ui/palette';


const sentimentChoices = ['happy', 'upset', 'suggesting']

const ViewHeader = styled('h3')`
  font-weight: 600;
  font-size: 16px;
  text-align: center;
  margin-top: 10px;
  margin-bottom: 10px;
`;

const StyledEmoji = styled('span')`
  padding-right: 8px;
`;

const getEmoji = (sentiment) => {
  switch(sentiment){
    case 'happy':
      return '🙂';
    case 'upset':
      return '😞'
    case 'suggesting':
      return '💡'
    default:
      return 'noemoji';
  }
}

const getCopy = (sentiment) => {
  switch(sentiment){
    case 'happy':
      return 'Yes, it did';
    case 'upset':
      return 'No, I still need help.'
    case 'suggesting':
      return 'I have a suggestion.'
    default:
      return 'noemoji';
  }
}

const Emoji = ({sentiment}) => {
  const emoji = getEmoji(sentiment)
  return (
    <StyledEmoji>
      {emoji}
    </StyledEmoji>
  );
};

const StyledSentiment = styled('div')`
  width: 100%;
`;
const StyledSentimentOption = styled('h4')`
  font-weight: 200!important;
  font-size: 16px!important;
  color: ${uiColors.gray.dark1}!important;
  margin-bottom: 0px;
`;

const SentimentOption = ({sentiment}) => {
  return (
    <StyledSentiment>
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