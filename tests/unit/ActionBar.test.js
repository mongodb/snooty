import React from 'react';
import { render, act } from '@testing-library/react';
import * as snootyMetadata from '../../src/utils/use-snooty-metadata';
import * as useAllDocsets from '../../src/hooks/useAllDocsets';
import ActionBar from '../../src/components/ActionBar/ActionBar';
import { PLACEHOLDER_TEXT } from '../../src/components/ActionBar/SearchInput';

jest.mock('../../src/hooks/use-site-metadata', () => ({
  useSiteMetadata: () => ({ reposDatabase: 'pool_test' }),
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

const mockConversationSpy = jest.fn();
// eslint-disable-next-line no-unused-vars
jest.mock('mongodb-chatbot-ui', () => ({
  __esModule: true,
  useChatbotContext: () => ({
    openChat: jest.fn(),
    setInputText: jest.fn(),
    handleSubmit: jest.fn(),
    conversation: {
      createConversation: mockConversationSpy,
      conversationId: null,
    },
  }),
  ModalView: () => null,
  MongoDbLegalDisclosure: () => null,
  mongoDbVerifyInformationMessage: 'Mock message',
  PoweredByAtlasVectorSearch: () => null,
  default: () => null,
}));

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
