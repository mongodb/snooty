import React, { useEffect } from 'react';
import { useChatbotContext, ModalView } from 'mongodb-chatbot-ui';
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
      initialMessageText={
        'Welcome to the MongoDB Assistant!\n\nAsk any question about MongoDB to receive expert guidance and documentation.'
      }
      initialMessageSuggestedPrompts={defaultSuggestedPrompts}
    />
  );
};

export default ChatbotModal;
