<<<<<<< HEAD
import { lazy } from 'react';
import styled from '@emotion/styled';
import { useSiteMetadata } from '../../../hooks/use-site-metadata';
=======
import { lazy, Suspense } from 'react';
import styled from '@emotion/styled';
import { theme } from '../../../theme/docsTheme';
>>>>>>> 2439c86 (layout of chatbot fab and feedback fab)

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
<<<<<<< HEAD
    border-width: 1px;
    position: unset;
=======
    right: 32px;
    bottom: 32px;
    border-width: 1px;
    position: unset;

    /* @media ${theme.screenSize.upToSmall} {
      position: unset;
    } */
>>>>>>> 2439c86 (layout of chatbot fab and feedback fab)
  }
`;

const ChatbotFab = () => {
<<<<<<< HEAD
  const { snootyEnv } = useSiteMetadata();

  const suggestedPrompts = [
    'How do you deploy a free cluster in Atlas?',
    'How do you import or migrate data into MongoDB?',
    'Get started with MongoDB',
  ];
  const CHATBOT_SERVER_BASE_URL =
    snootyEnv === 'dotcomprd'
      ? 'https://knowledge.mongodb.com/api/v1'
      : 'https://knowledge.staging.corp.mongodb.com/api/v1';
  return (
    <StyledChatBotFabContainer
      // Inline style to default hide Chatbot FAB, Optimizely to flip this on client-side
      style={{ display: 'none' }}
      // Classname below for Optimizely A/B testing
      className={fabChatbot}
    >
      <Chatbot serverBaseUrl={CHATBOT_SERVER_BASE_URL}>
        <InputBarTrigger suggestedPrompts={suggestedPrompts} />
        <FloatingActionButtonTrigger text={CHATBOT_WIDGET_TEXT} />
        <ModalView
          initialMessageText="Welcome to MongoDB AI Assistant. What can I help you with?"
          initialMessageSuggestedPrompts={suggestedPrompts}
          showDisclaimer
        />
      </Chatbot>
=======
  const suggestedPrompts = [
    'How do I create a new MongoDB Atlas cluster?',
    'Can MongoDB store lists of data?',
    'How does vector search work?',
  ];
  return (
    <StyledChatBotFabContainer
    // Inline style to default hide Chatbot FAB, Optimizely to flip this on client-side
    // style={{ display: 'none' }} // TODO: uncomment line below
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
>>>>>>> 2439c86 (layout of chatbot fab and feedback fab)
    </StyledChatBotFabContainer>
  );
};

export const fabChatbot = 'fab-chatbot';
<<<<<<< HEAD
export const CHATBOT_WIDGET_TEXT = 'Ask MongoDB AI';
=======
>>>>>>> 2439c86 (layout of chatbot fab and feedback fab)
export default ChatbotFab;
