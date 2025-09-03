import React from 'react';
import { render, fireEvent, waitFor, act } from '@testing-library/react';
import * as Gatsby from 'gatsby';
import * as ReachRouter from '@gatsbyjs/reach-router';
import CopyPageMarkdownButton from '../../src/components/Widgets/MarkdownWidget';

const renderCopyMarkdownButton = () => render(<CopyPageMarkdownButton />);

const mockedNavigate = jest.spyOn(Gatsby, 'navigate');
const mockedUseLocation = jest.spyOn(ReachRouter, 'useLocation') as jest.SpyInstance<Partial<Location>>;
const mockedConsoleError = jest.spyOn(console, 'error');
const mockedFetch = jest.spyOn(global, 'fetch') as jest.Mock;

const TEST_URL = 'http://localhost:8000/tutorial/foo/';

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
    mockedUseLocation.mockReturnValue({
      href: TEST_URL,
    });

    mockedNavigate.mockReset();
    mockedFetch.mockReset();
    jest.clearAllMocks();
  });

  it('copies markdown to the clipboard when button is clicked', async () => {
    // Mock fetch response
    mockedFetch.mockResolvedValue({
      ok: true,
      text: () => Promise.resolve('# Markdown content'),
    });

    // Render component
    let getByText: any;
    await act(async () => {
      const result = renderCopyMarkdownButton();
      getByText = result.getByText;
    });

    // Wait for the initial fetch to complete
    await waitFor(() => {
      // Verify fetch was called with correct URL
      expect(mockedFetch).toHaveBeenCalledWith(
        'http://localhost:8000/tutorial/foo.md',
        expect.objectContaining({
          signal: expect.any(AbortSignal),
        })
      );
    });

    // await new Promise(resolve => setTimeout(resolve, 100));

    // Click the button
    act(() => fireEvent.click(getByText('Copy page')));

    // Wait for the async operations to complete
    await waitFor(() => {
      // Verify clipboard was called with fetched markdown
      expect(navigator.clipboard.writeText).toHaveBeenCalledWith('# Markdown content');
    });
  });

  it('triggers error when hitting a 404 page', async () => {
    // Mock fetch response
    mockedFetch.mockResolvedValue({
      ok: false,
      statusCode: 404,
    });

    // Render component
    let getByText: any;
    await act(async () => {
      const result = renderCopyMarkdownButton();
      getByText = result.getByText;
    });

    // Wait for the initial fetch to complete
    await waitFor(() => {
      // Verify fetch was called with correct URL
      expect(mockedFetch).toHaveBeenCalledWith(
        'http://localhost:8000/tutorial/foo.md',
        expect.objectContaining({
          signal: expect.any(AbortSignal),
        })
      );
    });

    // Click the button
    act(() => fireEvent.click(getByText('Copy page')));

    // Wait for the async operations to complete
    await waitFor(() => {
      // Verify clipboard was called with fetched markdown
      expect(navigator.clipboard.writeText).not.toHaveBeenCalled();
      expect(mockedConsoleError).toHaveBeenCalled();
    });
  });
});
