import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { mockLocation } from '../utils/mock-location';
import DocumentBody from '../../src/components/DocumentBody';
import { FEEDBACK_BUTTON_TEXT } from '../../src/components/Widgets/FeedbackWidget/constants';
import { CHATBOT_WIDGET_TEXT } from '../../src/components/Widgets/ChatbotWidget/ChatbotFab';
import mockPageContext from './data/PageContext.test.json';
import mockSnootyMetadata from './data/SnootyMetadata.json';

jest.mock(`../../src/utils/use-snooty-metadata`, () => {
  return () => mockSnootyMetadata;
});

describe('DocumentBody', () => {
  beforeAll(() => {
    jest.spyOn(document, 'querySelector');
  });
  it('renders the necessary elements', async () => {
    mockLocation(null);
    render(<DocumentBody location={window.location} pageContext={mockPageContext} />);

    const footer = screen.getByTestId('consistent-footer');
    expect(footer).toBeVisible();
    expect(footer).toMatchSnapshot();

    if (!process.env.GATSBY_HIDE_UNIFIED_FOOTER_LOCALE) {
      const languageSelector = screen.getByTestId('options');
      expect(languageSelector).toBeInTheDocument();
      expect(languageSelector.querySelectorAll('li')).toHaveLength(2);
    }

    await waitFor(() => {
      const feedbackWidget = screen.getByText(FEEDBACK_BUTTON_TEXT);
      expect(feedbackWidget).toBeVisible();
      expect(feedbackWidget).toMatchSnapshot();

      const chatbotWidget = screen.getByText(CHATBOT_WIDGET_TEXT);
      expect(chatbotWidget).toBeVisible();
      expect(chatbotWidget).toMatchSnapshot();
    });

    const mainNav = screen.getByRole('img', { name: 'MongoDB logo' });
    expect(mainNav).toBeVisible();
    expect(mainNav).toMatchSnapshot();
  });

  it('does not render the following elements, footer, feedback widget, navigation', async () => {
    mockLocation('?presentation=true');
    render(<DocumentBody location={window.location} pageContext={mockPageContext} />);
    // use `queryBy` to avoid throwing an error with `getBy`
    const footer = screen.queryByTestId('consistent-footer');
    expect(footer).not.toBeInTheDocument();

    await waitFor(() => {
      const feedbackWidget = screen.queryByText(FEEDBACK_BUTTON_TEXT);
      expect(feedbackWidget).not.toBeInTheDocument();
    });

    const mainNav = screen.queryByRole('img', { name: 'MongoDB logo' });
    expect(mainNav).not.toBeInTheDocument();
  });
});

//TODO: Write the test for SideNav
describe('DefaultLayout', () => {});
