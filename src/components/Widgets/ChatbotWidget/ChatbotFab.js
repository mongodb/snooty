import { lazy } from 'react';
import styled from '@emotion/styled';

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
  }
`;

const ChatbotFab = () => {
  const suggestedPrompts = [
    'How do you deploy a free cluster in Atlas?',
    'How do you import or migrate data into MongoDB?',
    'Get started with MongoDB',
  ];
  return (
    <StyledChatBotFabContainer
      // Inline style to default hide Chatbot FAB, Optimizely to flip this on client-side
      // style={{ display: 'none' }} // TODO: uncomment line before merge
      // Classname below for Optimizely A/B testing
      className={fabChatbot}
    >
      <Chatbot>
        <InputBarTrigger suggestedPrompts={suggestedPrompts} />
        <FloatingActionButtonTrigger text={CHATBOT_WIDGET_TEXT} />
        <ModalView
          initialMessageText="Welcome to MongoDB AI Assistant. What can I help you with?"
          initialMessageSuggestedPrompts={suggestedPrompts}
          showDisclaimer
        />
      </Chatbot>
    </StyledChatBotFabContainer>
  );
};

export const fabChatbot = 'fab-chatbot';
export const CHATBOT_WIDGET_TEXT = 'Ask MongoDB AI';
export default ChatbotFab;
