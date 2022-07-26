import React from 'react';
import styled from '@emotion/styled';
import { sentimentChoices } from '../views/SentimentView';
import { useFeedbackState } from '../context';
import Emoji from '../components/Emoji';

//header for the comment view
//emoji icons and corresponding path labels
export const CommentHeader = ({ isPositive }) => {
  return (
    <Heading>
      {' '}
      {sentimentChoices.map((sentiment) => (
        <SentimentEmoji sentiment={sentiment} />
      ))}
    </Heading>
  );
};

const ResponsiveEmoji = styled.span`
  text-align: center important!;
  cursor: pointer;
  margin-left: 25px;
  font-size: 50px important;
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
    </ResponsiveEmoji>
  );
};

export const Layout = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const Heading = styled.h2`
  margin-top: 0;
  margin-bottom: 16px;
  width: 100%;
  text-align: left;
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
