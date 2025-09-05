import React from 'react';
import { render, act } from '@testing-library/react';
import * as snootyMetadata from '../../src/utils/use-snooty-metadata';
import * as useAllDocsets from '../../src/hooks/useAllDocsets';
import ActionBar from '../../src/components/ActionBar/ActionBar';
import { PLACEHOLDER_TEXT } from '../../src/components/ActionBar/SearchInput';

jest.mock('../../src/hooks/use-site-metadata', () => ({
  useSiteMetadata: () => ({ reposDatabase: 'pool_test' }),
}));

jest.mock('../../src/context/chatbot-context', () => ({
  useChatbot: () => ({
    chatbotClicked: false,
    setChatbotClicked: jest.fn(),
  }),
}));

jest.spyOn(snootyMetadata, 'default').mockImplementation(() => ({
  branch: 'master',
  project: '',
}));
jest.useFakeTimers();
const useAllDocsetsMock = jest.spyOn(useAllDocsets, 'useAllDocsets');
useAllDocsetsMock.mockImplementation(() => [
  {
    project: 'landing',
    branches: [],
    url: {},
    prefix: {},
  },
]);

const conversationSpy = jest.fn();
// eslint-disable-next-line no-unused-vars
const MongoDBChatbot = jest.mock('mongodb-chatbot-ui', () => {
  const chatbot = jest.requireActual('mongodb-chatbot-ui');

  return {
    __esModule: true,
    ...chatbot,
    useChatbotContext: () => ({
      setInputText: () => {},
      handleSubmit: () => {},
      conversation: {
        createConversation: conversationSpy,
        conversationId: null,
      },
    }),
  };
});

describe('ActionBar', () => {
  let consoleSpy;

  beforeAll(() => {
    // https://github.com/jsdom/jsdom/issues/2177
    // suppressing Error: Could not parse CSS stylesheet
    consoleSpy = jest.spyOn(console, 'error').mockImplementation((message) => {
      if (!message?.message?.includes('Could not parse CSS stylesheet')) {
        console.warn(message);
      }
    });
  });

  afterAll(() => consoleSpy.mockRestore());

  describe('Universal Search input ', () => {
    it('loads the input search bar, dark mode menu and feedback button', async () => {
      let wrapper;

      await act(async () => {
        wrapper = render(<ActionBar template="document" slug="/" sidenav={true} />);
      });
      expect(wrapper.getByRole('search')).toBeTruthy();
      expect(wrapper.getByPlaceholderText(PLACEHOLDER_TEXT)).toBeTruthy();
      expect(wrapper.getByLabelText('Dark Mode Menu')).toBeTruthy();
    });
  });
});
