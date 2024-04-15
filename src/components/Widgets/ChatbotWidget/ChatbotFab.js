import React, { lazy, Fragment, useTransition, useState } from 'react';
import styled from '@emotion/styled';
import { css, cx } from '@leafygreen-ui/emotion';
import { palette } from '@leafygreen-ui/palette';
import Icon from '@leafygreen-ui/icon';
import { SuspenseHelper } from '../../SuspenseHelper';
import { SpinnerIcon } from '../FeedbackWidget/icons';

import { theme } from '../../../theme/docsTheme';
import { useSiteMetadata } from '../../../hooks/use-site-metadata';
import { DEFAULT_MAX_INPUT, defaultSuggestedPrompts } from '../../ChatbotUi';
import { MongoDbLegalDisclosure } from './MongoDBLegal';
import { PoweredByAtlasVectorSearch } from './PoweredByAtlasSearch';

const Chatbot = lazy(() => import('mongodb-chatbot-ui'));

const ModalView = lazy(() => import('mongodb-chatbot-ui').then((module) => ({ default: module.ModalView })));

const containerStyle = css`
  display: flex;
  align-items: center;
  gap: 4px;
  cursor: pointer;
  padding: 12px ${theme.size.default};
  background-color: ${palette.white};
  border: 1px solid ${palette.green.dark1};
  border-radius: 40px;
  box-shadow: 0px 4px 10px -4px ${palette.gray.light2};
  z-index: 9;
  color: ${palette.green.dark2};
  font-weight: 600;
  font-size: 13px;
  line-height: 20px;

  :hover {
    box-shadow: 0px 0px 0px 3px ${palette.blue.light2};
  }

  @media ${theme.screenSize.upToSmall} {
    bottom: ${theme.size.medium};
    right: ${theme.size.medium};
  }
`;

const sparkIconStyle = css`
  color: ${palette.green.dark1};
`;

const StyledChatBotFabContainer = styled.div`
  > button {
    border-width: 1px;
    position: unset;
  }
`;
const ChatbotButton = ({ onClick, isLoading = false }) => {
  return isLoading ? (
    <button className={cx(containerStyle)} onClick={onClick} disabled={true}>
      <SpinnerIcon />
    </button>
  ) : (
    <button className={cx(containerStyle)} onClick={onClick}>
      <Icon className={sparkIconStyle} glyph="Sparkle" />
      {CHATBOT_WIDGET_TEXT}
    </button>
  );
};
const ChatbotFab = () => {
  const { snootyEnv } = useSiteMetadata();
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const CHATBOT_SERVER_BASE_URL =
    snootyEnv === 'dotcomprd'
      ? 'https://knowledge.mongodb.com/api/v1'
      : 'https://knowledge.staging.corp.mongodb.com/api/v1';
  return (
    <StyledChatBotFabContainer
      // Classname below to help ignore element for screenshots
      className={fabChatbot}
    >
      <SuspenseHelper fallback={null}>
        <ChatbotButton
          isLoading={isPending}
          onClick={() =>
            startTransition(() => {
              setIsOpen(!isOpen);
            })
          }
        />
        {isOpen && (
          <Chatbot
            open={isOpen}
            name="MongoDB AI"
            maxInputCharacters={DEFAULT_MAX_INPUT}
            serverBaseUrl={CHATBOT_SERVER_BASE_URL}
            closeChatOverride={() => {
              setIsOpen(false);
              return true;
            }}
          >
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
              initialMessageSuggestedPrompts={defaultSuggestedPrompts}
              inputBottomText={BOTTOM_TEXT}
            />
          </Chatbot>
        )}
      </SuspenseHelper>
    </StyledChatBotFabContainer>
  );
};

export const fabChatbot = 'fab-chatbot';
export const CHATBOT_WIDGET_TEXT = 'Ask MongoDB AI';
export const BOTTOM_TEXT =
  'This is an experimental generative AI chatbot. All information should be verified prior to use.';
export default ChatbotFab;
