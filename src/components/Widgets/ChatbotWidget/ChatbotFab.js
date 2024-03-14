import { lazy, Fragment } from 'react';
import styled from '@emotion/styled';
import { css } from '@emotion/react';
import { useSiteMetadata } from '../../../hooks/use-site-metadata';
import { DEFAULT_MAX_INPUT } from '../../ChatbotUi';
import { MongoDbLegalDisclosure } from './MongoDBLegal';
import { PoweredByAtlasVectorSearch } from './PoweredByAtlasSearch';

const Chatbot = lazy(() => import('mongodb-chatbot-ui'));
const FloatingActionButtonTrigger = lazy(() =>
  import('mongodb-chatbot-ui').then((module) => ({ default: module.FloatingActionButtonTrigger }))
);
const ModalView = lazy(() => import('mongodb-chatbot-ui').then((module) => ({ default: module.ModalView })));

const StyledChatBotFabContainer = styled.div`
  > button {
    border-width: 1px;
    position: unset;
  }
`;

const ChatbotFab = () => {
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
      // Classname below to help ignore element for screenshots
      className={fabChatbot}
    >
      <Chatbot name="MongoDB AI" maxInputCharacters={DEFAULT_MAX_INPUT} serverBaseUrl={CHATBOT_SERVER_BASE_URL}>
        <FloatingActionButtonTrigger text={CHATBOT_WIDGET_TEXT} />
        <ModalView
          disclaimer={
            <Fragment>
              <MongoDbLegalDisclosure />
              <PoweredByAtlasVectorSearch
                linkStyle="text"
                className={css`
                  margin-top: 8px;
                `}
              />
            </Fragment>
          }
          initialMessageText="Welcome to the MongoDB AI Assistant. What can I help you with?"
          initialMessageSuggestedPrompts={suggestedPrompts}
          inputBottomText={BOTTOM_TEXT}
        />
      </Chatbot>
    </StyledChatBotFabContainer>
  );
};

export const fabChatbot = 'fab-chatbot';
export const CHATBOT_WIDGET_TEXT = 'Ask MongoDB AI';
export const BOTTOM_TEXT =
  'This is an experimental generative AI chatbot. All information should be verified prior to use.';
export default ChatbotFab;
