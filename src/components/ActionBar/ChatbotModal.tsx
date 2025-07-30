import React, { useEffect } from 'react';
import { useChatbotContext, ModalView, MongoDbLegalDisclosure, PoweredByAtlasVectorSearch } from 'mongodb-chatbot-ui';
import { css } from '@leafygreen-ui/emotion';
import { defaultSuggestedPrompts } from '../ChatbotUi';

interface ChatbotModalProps {
  chatbotClicked: boolean;
  setChatbotClicked: (chatbotClicked: boolean) => void;
}

const ChatbotModal = ({ chatbotClicked, setChatbotClicked }: ChatbotModalProps) => {
  const { openChat } = useChatbotContext();
  useEffect(() => {
    if (chatbotClicked) {
      openChat();
      setChatbotClicked(false);
    }
  }, [chatbotClicked, openChat, setChatbotClicked]);

  return (
    <ModalView
      inputBottomText={
        'This is an experimental generative AI chatbot. All information should be verified prior to use.'
      }
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
