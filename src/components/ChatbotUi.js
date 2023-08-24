import React, { lazy } from 'react';
import styled from '@emotion/styled';
import { css } from '@emotion/react';
import { theme } from '../theme/docsTheme';

const formWith = (measurement) => {
  let _measurement = measurement;

  if (typeof measurement !== 'string' && typeof measurement !== 'number') {
    console.error('using the wrong measurement value');
    // set it to the original style from the package
    _measurement = '100%';
  }

  if (typeof measurement === 'number') {
    _measurement = `${measurement}px`;
  }
  return css`
    form {
      width: ${_measurement};
    }
  `;
};

const StyledChatBotUiContainer = styled.div`
  margin-left: 60px;
  margin-top: 20px;
  ${formWith(771)}

  @media ${theme.screenSize.upToXLarge} {
    ${formWith(704)}
  }

  @media ${theme.screenSize.upToMedium} {
    ${formWith('90%')}
  }
`;

const LazyChatbot = lazy(() => import('mongodb-chatbot-ui'));

const ChatbotUi = () => {
  return (
    <StyledChatBotUiContainer data-testid="chatbot-ui">
      {/* We can wrap this in a Suspend to render a loading state if we decided we want that */}
      <LazyChatbot />
    </StyledChatBotUiContainer>
  );
};

export default ChatbotUi;
