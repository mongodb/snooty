import React, { forwardRef, useCallback, useEffect, useImperativeHandle } from 'react';
import { useChatbotContext } from 'mongodb-chatbot-ui';
import PropTypes from 'prop-types';

// Using a forward ref and imperative handle
// to expose lazy loaded child (chatbot) behaviors to parent (SearchInput)
// https://react.dev/reference/react/useImperativeHandle
const ChatbotSearchContent = forwardRef(function ChatbotSearchContent(
  { searchValue, setChatbotAvailable, children },
  ref
) {
  const { setInputText, handleSubmit, conversation } = useChatbotContext();

  const onClick = useCallback(() => {
    setInputText(searchValue);
    handleSubmit(searchValue);
  }, [handleSubmit, searchValue, setInputText]);

  useImperativeHandle(ref, () => {
    return {
      onClick,
    };
  });

  // once on load, load a new conversation
  useEffect(() => {
    const init = async () => {
      if (!conversation.conversationId) {
        await conversation.createConversation();
        setChatbotAvailable(!!!conversation.error);
      }
    };
    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <>{children}</>;
});

export default ChatbotSearchContent;

ChatbotSearchContent.propTypes = {
  searchValue: PropTypes.string.isRequired,
  setChatbotAvailable: PropTypes.func.isRequired,
};
