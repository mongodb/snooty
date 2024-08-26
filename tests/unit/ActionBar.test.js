import React from 'react';
import { render, act } from '@testing-library/react';
import * as snootyMetadata from '../../src/utils/use-snooty-metadata';
import ActionBar from '../../src/components/ActionBar/ActionBar';

jest.mock('../../src/hooks/use-site-metadata', () => ({
  useSiteMetadata: () => ({ reposDatabase: 'pool_test' }),
}));
jest.spyOn(snootyMetadata, 'default').mockImplementation(() => ({
  branch: 'master',
  project: '',
}));
jest.useFakeTimers();

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
    it('lazy loads the input search bar, initially loads dark mode menu and feedback button', async () => {
      let wrapper;

      await act(async () => {
        wrapper = render(<ActionBar />);
      });
      expect(wrapper.getByRole('search')).toBeTruthy();
      expect(wrapper.getByPlaceholderText('Search MongoDB Docs or Ask MongoDB AI')).toBeTruthy();
      expect(wrapper.getByLabelText('Dark Mode Menu')).toBeTruthy();
      expect(wrapper.getByText('Feedback')).toBeTruthy();
      expect(wrapper).toMatchSnapshot();
    });
  });
});
