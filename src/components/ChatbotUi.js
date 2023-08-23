import React from 'react';
import Chatbot from 'mongodb-chatbot-ui';
import styled from '@emotion/styled';
import { theme } from '../theme/docsTheme';

const StyledChatBotUiContainer = styled.div`
  ${theme.screenSize.mediumAndUp} {
    width: 771px;
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
