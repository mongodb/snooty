import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import * as Gatsby from 'gatsby';
import * as ReachRouter from '@gatsbyjs/reach-router';
import CopyPageMarkdownButton from '../../src/components/Widgets/MarkdownWidget';

// Create mock functions that we can access in tests
const mockOpenChat = jest.fn();
const mockSetInputText = jest.fn();

// Mock mongodb-chatbot-ui
jest.mock('mongodb-chatbot-ui', () => ({
  __esModule: true,
  useChatbotContext: () => ({
    openChat: mockOpenChat,
    setInputText: mockSetInputText,
    handleSubmit: jest.fn(),
  }),
  default: () => null,
}));

const renderCopyMarkdownButton = (props = {}) => render(<CopyPageMarkdownButton {...props} />);

const mockedNavigate = jest.spyOn(Gatsby, 'navigate');
const mockedUseLocation = jest.spyOn(ReachRouter, 'useLocation') as jest.SpyInstance<Partial<Location>>;
const mockedConsoleError = jest.spyOn(console, 'error');
const mockedFetch = jest.spyOn(global, 'fetch') as jest.Mock;
jest.mock('../../src/hooks/use-site-metadata', () => ({
  useSiteMetadata: () => ({
    pathPrefix: '/docs/atlas',
  }),
}));

// Mock clipboard
Object.defineProperty(global.navigator, 'clipboard', {
  value: {
    writeText: jest.fn(),
  },
  writable: true,
});

describe('Copy markdown button', () => {
  beforeEach(() => {
    // Mock location
    mockedUseLocation.mockReturnValueOnce({
      href: 'http://localhost:8000/tutorial/foo/',
    });

    mockedNavigate.mockReset();
    mockedFetch.mockReset();
    mockOpenChat.mockReset();
    mockSetInputText.mockReset();
    jest.clearAllMocks();
  });

  it('copies markdown to the clipboard when button is clicked', async () => {
    // Mock fetch response
    mockedFetch.mockResolvedValueOnce({
      ok: true,
      text: () => Promise.resolve('# Markdown content'),
    });

    // Render component
    const { getByText } = renderCopyMarkdownButton();

    // Click the button
    fireEvent.click(getByText('Copy page'));

    // Wait for the async operations to complete
    await waitFor(() => {
      // Verify fetch was called with correct URL
      expect(mockedFetch).toHaveBeenCalledWith('http://localhost:8000/tutorial/foo.md');

      // Verify clipboard was called with fetched markdown
      expect(navigator.clipboard.writeText).toHaveBeenCalledWith('# Markdown content');
    });
  });

  it('triggers error when hitting a 404 page', async () => {
    // Mock fetch response
    mockedFetch.mockResolvedValueOnce({
      ok: false,
      statusCode: 404,
    });

    // Render component
    const { getByText } = renderCopyMarkdownButton();

    // Click the button
    fireEvent.click(getByText('Copy page'));

    // Wait for the async operations to complete
    await waitFor(() => {
      // Verify fetch was called with correct URL
      expect(mockedFetch).toHaveBeenCalledWith('http://localhost:8000/tutorial/foo.md');

      // Verify clipboard was called with fetched markdown
      expect(navigator.clipboard.writeText).not.toHaveBeenCalled();
      expect(mockedConsoleError).toHaveBeenCalled();
    });
  });

  it('opens chatbot with pre-filled message question about the current page', async () => {
    // Render component with a slug prop
    const { getByLabelText, getByText } = renderCopyMarkdownButton({ slug: 'tutorial/foo' });

    // Click the dropdown trigger (arrow button) to open the menu
    fireEvent.click(getByLabelText('More options'));

    // Wait for menu to appear and click "Ask a Question"
    await waitFor(() => {
      expect(getByText('Ask a Question')).toBeInTheDocument();
    });

    fireEvent.click(getByText('Ask a Question'));

    // Verify that setInputText was called with the correct message
    expect(mockSetInputText).toHaveBeenCalledWith(
      "I have a question about the page I'm on: www.mongodb.com/docs/atlas/tutorial/foo"
    );

    // Verify that openChat was called
    expect(mockOpenChat).toHaveBeenCalled();
  });
});
