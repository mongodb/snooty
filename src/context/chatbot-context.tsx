import React, { createContext, useContext, useState, ReactNode } from 'react';

interface ChatbotContextType {
  chatbotClicked: boolean;
  setChatbotClicked: (clicked: boolean) => void;
  openChatbot: () => void;
  openChatbotWithText: (text: string) => void;
  pendingInputText: string | null;
}

const ChatbotContext = createContext<ChatbotContextType | undefined>(undefined);

interface ChatbotProviderProps {
  children: ReactNode;
}

export const ChatbotProvider = ({ children }: ChatbotProviderProps) => {
  const [chatbotClicked, setChatbotClicked] = useState(false);
  const [pendingInputText, setPendingInputText] = useState<string | null>(null);

  const openChatbot = () => {
    setChatbotClicked(true);
  };

  const openChatbotWithText = (text: string) => {
    setPendingInputText(text);
    setChatbotClicked(true);
  };

  return (
    <ChatbotContext.Provider
      value={{
        chatbotClicked,
        setChatbotClicked,
        openChatbot,
        openChatbotWithText,
        pendingInputText,
      }}
    >
      {children}
    </ChatbotContext.Provider>
  );
};

export const useChatbot = (): ChatbotContextType => {
  const context = useContext(ChatbotContext);
  if (!context) {
    throw new Error('useChatbot() must be used within a ChatbotProvider');
  }
  return context;
};
