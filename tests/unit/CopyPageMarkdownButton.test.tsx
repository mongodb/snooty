import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import * as Gatsby from 'gatsby';
import * as ReachRouter from '@gatsbyjs/reach-router';
import CopyPageMarkdownButton from '../../src/components/Widgets/MarkdownWidget';

const renderCopyMarkdownButton = () => render(<CopyPageMarkdownButton />);

const mockedNavigate = jest.spyOn(Gatsby, 'navigate');
const mockedUseLocation = jest.spyOn(ReachRouter, 'useLocation') as jest.SpyInstance<Partial<Location>>;
const mockedConsoleError = jest.spyOn(console, 'error');
const mockedFetch = jest.spyOn(global, 'fetch') as jest.Mock;

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
});
