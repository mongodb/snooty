import React from 'react';
import styled from '@emotion/styled';
import { theme } from '../../../../theme/docsTheme';

const StyledEmoji = styled('span')`
  font-size: ${theme.fontSize.h2};
`;

const getEmoji = (sentiment) => {
  switch (sentiment) {
    case 'Positive':
      return '🙂';
    case 'Negative':
      return '😞';
    case 'Suggestion':
      return '💡';
    default:
      return 'noemoji';
  }
};

const Emoji = ({ sentiment }) => {
  const emoji = getEmoji(sentiment);
  return <StyledEmoji>{emoji}</StyledEmoji>;
};

export default Emoji;
