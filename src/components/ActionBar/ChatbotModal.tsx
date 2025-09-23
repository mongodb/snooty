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
import { useChatbotModal } from '../../context/chatbot-context';

const ChatbotModal = () => {
  const { openChat, setInputText } = useChatbotContext();
  const { chatbotClicked, setChatbotClicked, text, setText } = useChatbotModal();

  useEffect(() => {
    if (chatbotClicked) {
      setInputText(text);
      openChat();
      setChatbotClicked(false);
      setText('');
    }
  }, [chatbotClicked]); // eslint-disable-line react-hooks/exhaustive-deps

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
