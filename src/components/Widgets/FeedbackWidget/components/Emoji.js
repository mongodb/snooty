import React from 'react';
import styled from '@emotion/styled';
import { theme } from '../../../../theme/docsTheme';

const StyledEmoji = styled('span')`
  padding-right: ${theme.size.small};
  font-size: 22px;
`;

const getEmoji = (sentiment) => {
  switch (sentiment) {
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

const Emoji = ({ sentiment }) => {
  const emoji = getEmoji(sentiment);
  return <StyledEmoji>{emoji}</StyledEmoji>;
};

export default Emoji;
