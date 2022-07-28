import React from 'react';
import styled from '@emotion/styled';
import { sentimentChoices } from '../views/SentimentView';
import { useFeedbackState } from '../context';
import Emoji from '../components/Emoji';

const getPath = (sentiment) => {
  switch (sentiment) {
    case 'positive':
      return 'Helpful';
    case 'negative':
      return 'Unhelpful';
    case 'suggestion':
      return 'Idea';
    default:
      return 'none';
  }
};

//header for the comment view
//emoji icons and corresponding path labels
export const CommentHeader = ({ isPositive }) => {
  return (
    <Heading>
      {sentimentChoices.map((sentiment) => (
        <SentimentEmoji sentiment={sentiment} />
      ))}
    </Heading>
  );
};

const ResponsiveEmoji = styled('div')`
  cursor: pointer;
  margin-top: 3px;
  display: inline-block;
  vertical-align: left;
  width: 30%;
`;

const StyledSentimentPath = styled('span')`
  font-weight: 400 !important;
  font-size: 14px !important;
  text-align: center;
  margin: 0px -10px;
  line-height: 20px;
  margin-right: 2px;
  padding: 3px;
  display: block;
  text-align: center;
  letter-spacing: 0.2px;
`;

//renders each emoji icon in comment view
//icon corresponding to the selected path highlighted, others are faded
const SentimentEmoji = ({ sentiment }) => {
  const { selectedSentiment, setSentiment } = useFeedbackState();
  return (
    <ResponsiveEmoji
      onClick={(sentiment) => setSentiment(sentiment)}
      style={{
        opacity: sentiment === selectedSentiment ? '1' : '0.5',
        transition: '0.2s',
      }}
    >
      <Emoji sentiment={sentiment} />
      <StyledSentimentPath
        style={{
          opacity: sentiment === selectedSentiment ? '0.7' : '0.0',
          transition: '0.2s',
        }}
      >
        {getPath(sentiment)}
      </StyledSentimentPath>
    </ResponsiveEmoji>
  );
};

/** 
const SentimentPath = ({ sentiment }) => {
  const { selectedSentiment } = useFeedbackState();
  return (
        <StyledSentimentPath style={{
        opacity: sentiment === selectedSentiment ? '0.7' : '0.0',
        transition: '0.2s',
      }}>
        {getPath(sentiment)}
      </StyledSentimentPath>
        
  );
};
*/

export const Layout = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const Heading = styled.h2`
  margin-top: 0;
  margin-bottom: 16px;
  width: 100%;
  text-align: center;
  font-weight: regular;
  font-size: 16px;
`;

export const Subheading = styled.p`
  margin-top: 0;
  margin-bottom: 16px;
  width: 100%;
  text-align: left;
  font-weight: regular;
  font-size: 14px;
`;

export const Footer = styled.div`
  margin-top: 0;
  margin-bottom: 24px;
  width: 100%;
  font-weight: normal;
  display: flex;
  flex-direction: row-reverse;
  justify-content: space-between;
  align-items: center;
`;
