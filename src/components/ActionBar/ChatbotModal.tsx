import React, { useEffect } from 'react';
import {
  useChatbotContext,
  ModalView,
  MongoDbLegalDisclosure,
  mongoDbVerifyInformationMessage,
  PoweredByAtlasVectorSearch,
} from 'mongodb-chatbot-ui';
import { css } from '@leafygreen-ui/emotion';
import { useChatbot } from '../../context/chatbot-context';
import { defaultSuggestedPrompts } from '../ChatbotUi';

interface ChatbotModalProps {
  chatbotClicked: boolean;
  setChatbotClicked: (chatbotClicked: boolean) => void;
}

const ChatbotModal = ({ chatbotClicked, setChatbotClicked }: ChatbotModalProps) => {
  const { openChat, setInputText } = useChatbotContext();
  const { pendingInputText } = useChatbot();

  useEffect(() => {
    if (chatbotClicked) {
      openChat();

      // Set the input text if we have pending text
      if (pendingInputText) {
        setInputText(pendingInputText);
      }

      setChatbotClicked(false);
    }
  }, [chatbotClicked, openChat, setChatbotClicked, pendingInputText, setInputText]);

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
