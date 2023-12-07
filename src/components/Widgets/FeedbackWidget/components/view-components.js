import React from 'react';
import styled from '@emotion/styled';
import { theme } from '../../../../theme/docsTheme';
import { useFeedbackContext } from '../context';
import { sentimentChoices } from '../views/SentimentView';
import Emoji from '../components/Emoji';

export const Layout = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const Heading = styled.h2`
  margin-top: 5px;
  margin-bottom: 16px;
  width: 100%;
  text-align: center;
  font-weight: regular;
  font-size: ${theme.fontSize.default};
`;

export const Subheading = styled.p`
  margin-top: 0;
  margin-bottom: 16px;
  width: 100%;
  text-align: center;
  font-weight: regular;
  font-size: ${theme.fontSize.small};
`;

export const Footer = styled.div`
  margin-top: 0;
  margin-bottom: 10px;
  width: 100%;
  font-weight: normal;
  display: flex;
  flex-direction: row-reverse;
  justify-content: space-between;
  align-items: center;
`;

const ResponsiveEmoji = styled('div')`
  cursor: pointer;
  margin-top: 3px;
  display: inline-block;
  vertical-align: left;
  width: 33.3%;
  margin-top: -5px;
`;

const StyledSentimentPath = styled('span')`
  font-weight: 400 !important;
  font-size: ${theme.fontSize.small} !important;
  text-align: center;
  margin: 0px -10px;
  line-height: 20px;
  display: block;
  letter-spacing: 0.2px;
  padding: 3px;
`;

//renders each emoji icon in comment view
//icon corresponding to the selected path highlighted, others are faded
const SentimentEmoji = ({ path }) => {
  const { selectedSentiment, selectSentiment } = useFeedbackContext();
  const sentiment = path.sentiment;
  return (
    <ResponsiveEmoji
      onClick={() => selectSentiment(path.sentiment)}
      style={{
        opacity: sentiment === selectedSentiment ? '1' : '0.5',
      }}
    >
      <Emoji sentiment={path.sentiment} />
      <StyledSentimentPath
        style={{
          opacity: sentiment === selectedSentiment ? '0.7' : '0.0',
        }}
      >
        {path.category}
      </StyledSentimentPath>
    </ResponsiveEmoji>
  );
};

//header for the comment view
//emoji icons and corresponding path labels
export const CommentHeader = () => {
  return (
    <Heading>
      {sentimentChoices.map((path) => (
        <SentimentEmoji path={path} key={path.category} />
      ))}
    </Heading>
  );
};
