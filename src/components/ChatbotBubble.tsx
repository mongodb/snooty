import Chatbot, {
  FloatingActionButtonTrigger,
  InputBarTrigger,
  ModalView,
} from "mongodb-chatbot-ui";

const ChatbotBubble = () => {
  const suggestedPrompts = [
    "How do I create a new MongoDB Atlas cluster?",
    "Can MongoDB store lists of data?",
    "How does vector search work?",
  ];
  return (
    <div>
      <Chatbot>
        <InputBarTrigger suggestedPrompts={suggestedPrompts} />
        <FloatingActionButtonTrigger text="My MongoDB AI" />
        <ModalView
          initialMessageText="Welcome to MongoDB AI Assistant. What can I help you with?"
          initialMessageSuggestedPrompts={suggestedPrompts}
        />
      </Chatbot>
    </div>
  );
}

export default ChatbotBubble;
