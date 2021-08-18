import React, { useState, useEffect } from 'react';
import { theme } from '../../../../theme/docsTheme';
import { css, cx } from '@leafygreen-ui/emotion';
import { useFeedbackState } from '../context';

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

const getEmojiCharacter = (character) => {
  console.log(character);
  switch (character) {
    case 'happy':
      return '🙂';
    case 'upset':
      return '😞';
    case 'suggesting':
      return '💡';
    default:
      return 'noemoji';
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

const Emoji = ({ character, currPage }) => {
  const { sentiment } = useFeedbackState();
  const [isActive, setIsActive] = useState();
  useEffect(() => {
    setIsActive(sentiment == character);
  }, [sentiment, character]);
  console.log(sentiment, isActive);
  return <span className={cx(getStyledEmoji(currPage, isActive))}>{getEmojiCharacter(character)}</span>;
};

export default Emoji;
