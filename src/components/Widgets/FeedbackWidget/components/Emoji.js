import React, { useState, useEffect } from 'react';
import { theme } from '../../../../theme/docsTheme';
import { css, cx } from '@leafygreen-ui/emotion';
import { useFeedbackState } from '../context';
import styled from '@emotion/styled';

const sentimentStyle = css`
  padding-right: ${theme.size.small};
  font-size: 22px !important;
`;

const commentStyle = ({ isActive }) => css`
  ${console.log(isActive)}
  font-size: ${theme.size.medium} !important;
  padding: 17px;
  ${!isActive && `opacity: 0.5`}
`;

const getEmojiInfo = (sentiment) => {
  console.log(sentiment);
  switch (sentiment) {
    case 'happy':
      return { character: '🙂', copy: 'Helpful' };
    case 'upset':
      return { character: '😞', copy: 'Unhelpful' };
    case 'suggesting':
      return { character: '💡', copy: 'Idea' };
    default:
      return undefined;
  }
};

const getStyledEmoji = (currPage, isActive) => {
  switch (currPage) {
    case 'sentimentView':
      return sentimentStyle;
    case 'commentView':
      return commentStyle({ isActive });
  }
};

// const emojiFactory = ({sentiment, currPage, isActive}) => {
//   switch (currPage) {
//     case 'sentimentView':
//       return <SentimentEmoji>{getEmojiInfo(sentiment)}</SentimentEmoji>;;
//     case 'commentView':
//       return commentStyle({ isActive });
//   }
// }

const Emoji = ({ sentiment, currPage }) => {
  const { activeSentiment } = useFeedbackState();
  const [isActive, setIsActive] = useState();
  useEffect(() => {
    setIsActive(activeSentiment == sentiment);
  }, [activeSentiment, sentiment]);
  console.log(sentiment);
  return <span className={cx(getStyledEmoji(currPage, isActive))}>{getEmojiInfo(sentiment).character}</span>;
};

export default Emoji;
