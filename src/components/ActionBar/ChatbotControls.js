import { forwardRef, useCallback, useImperativeHandle } from 'react';
import { useChatbotContext } from 'mongodb-chatbot-ui';
import PropTypes from 'prop-types';

// Using a forward ref and imperative handle
// to expose lazy loaded child (chatbot) behaviors to parent (SearchInput)
// https://react.dev/reference/react/useImperativeHandle
const ChatbotControls = forwardRef(function ChatbotControls({ searchValue }, ref) {
  const { setInputText, handleSubmit, openChat } = useChatbotContext();

  const onClick = useCallback(async () => {
    await openChat();
    setInputText(searchValue);
    handleSubmit(searchValue);
  }, [handleSubmit, openChat, searchValue, setInputText]);

  useImperativeHandle(ref, () => {
    return {
      onClick,
    };
  });
});

export default ChatbotControls;

ChatbotControls.propTypes = {
  searchValue: PropTypes.string.isRequired,
};
