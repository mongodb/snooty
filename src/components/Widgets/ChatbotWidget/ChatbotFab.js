import { lazy, Suspense } from 'react';
import styled from '@emotion/styled';
import { theme } from '../../../theme/docsTheme';

const Chatbot = lazy(() => import('mongodb-chatbot-ui'));

const InputBarTrigger = lazy(() =>
  import('mongodb-chatbot-ui').then((module) => ({ default: module.InputBarTrigger }))
);
const FloatingActionButtonTrigger = lazy(() =>
  import('mongodb-chatbot-ui').then((module) => ({ default: module.FloatingActionButtonTrigger }))
);
const ModalView = lazy(() => import('mongodb-chatbot-ui').then((module) => ({ default: module.ModalView })));

const StyledChatBotFabContainer = styled.div`
  > div {
    display: none;
  }
  > button {
    right: 32px;
    bottom: 32px;
    border-width: 1px;
    position: unset;

    /* @media ${theme.screenSize.upToSmall} {
      position: unset;
    } */
  }
`;

const ChatbotFab = () => {
  const suggestedPrompts = [
    'How do I create a new MongoDB Atlas cluster?',
    'Can MongoDB store lists of data?',
    'How does vector search work?',
  ];
  return (
    <StyledChatBotFabContainer
    // style={{ display: 'none' }}
    >
      <Suspense fallback={null}>
        <Chatbot className={fabChatbot}>
          <InputBarTrigger suggestedPrompts={suggestedPrompts} />
          <FloatingActionButtonTrigger text="Ask MongoDB AI" />
          <ModalView
            initialMessageText="Welcome to MongoDB AI Assistant. What can I help you with?"
            initialMessageSuggestedPrompts={suggestedPrompts}
          />
        </Chatbot>
      </Suspense>
    </StyledChatBotFabContainer>
  );
};

export const fabChatbot = 'fab-chatbot';
export default ChatbotFab;
