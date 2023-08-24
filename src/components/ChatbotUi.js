import React from 'react';
import Chatbot from 'mongodb-chatbot-ui';
import styled from '@emotion/styled';
import { css } from '@emotion/react';
import { theme } from '../theme/docsTheme';

const formWith = (measurement) => {
  return css`
    form {
      width: ${measurement};
    }
  `;
};

const StyledChatBotUiContainer = styled.div`
  margin-left: 60px;
  margin-top: 20px;
  ${formWith('771px')}

  @media ${theme.screenSize.upToXLarge} {
    ${formWith('704px')}
  }

  @media ${theme.screenSize.upToMedium} {
    ${formWith('90%')}
  }
`;

const ChatbotUi = () => {
  return (
    <StyledChatBotUiContainer>
      <Chatbot />
    </StyledChatBotUiContainer>
  );
};

export default ChatbotUi;
