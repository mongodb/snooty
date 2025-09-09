import React, { useEffect } from 'react';
import {
  useChatbotContext,
  ModalView,
  MongoDbLegalDisclosure,
  mongoDbVerifyInformationMessage,
  PoweredByAtlasVectorSearch,
} from 'mongodb-chatbot-ui';
import { css } from '@leafygreen-ui/emotion';
import { defaultSuggestedPrompts } from '../ChatbotUi';

interface ChatbotModalProps {
  chatbotClicked: boolean;
  setChatbotClicked: (chatbotClicked: boolean) => void;
}

const ChatbotModal = ({ chatbotClicked, setChatbotClicked }: ChatbotModalProps) => {
  const { openChat, setInputText } = useChatbotContext();
  useEffect(() => {
    if (chatbotClicked) {
      setInputText('');
      openChat();
      setChatbotClicked(false);
    }
  }, [chatbotClicked, setInputText, openChat, setChatbotClicked]);

  return (
    <ModalView
      inputBottomText={mongoDbVerifyInformationMessage}
      disclaimer={
        <>
          <MongoDbLegalDisclosure />
          <PoweredByAtlasVectorSearch
            linkStyle="text"
            className={css`
              margin-top: 8px;
            `}
          />
        </>
      }
      initialMessageText={'Welcome to MongoDB AI'}
      initialMessageSuggestedPrompts={defaultSuggestedPrompts}
    />
  );
};

export default ChatbotModal;
