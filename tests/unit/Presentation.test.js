import React from 'react';
import { render, screen } from '@testing-library/react';
import { mockLocation } from '../utils/mock-location';
import DocumentBody from '../../src/components/DocumentBody';
import { constants } from '../../src/components/Widgets/FeedbackWidget';
import mockPageContext from './data/PageContext.test.json';
import mockSnootyMetadata from './data/SnootyMetadata.json';

jest.mock(`../../src/utils/use-snooty-metadata`, () => {
  return () => mockSnootyMetadata;
});

describe('DocumentBody', () => {
  beforeAll(() => {
    jest.spyOn(document, 'querySelector');
  });
  it('renders the necessary elements', () => {
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

    const feedbackWidget = screen.getByText(constants.text.feedbackButton);
    expect(feedbackWidget).toBeVisible();
    expect(feedbackWidget).toMatchSnapshot();

    const mainNav = screen.getByRole('img', { name: 'MongoDB logo' });
    expect(mainNav).toBeVisible();
    expect(mainNav).toMatchSnapshot();
  });

  it('does not render the following elements, footer, feedback widget, navigation', () => {
    mockLocation('?presentation=true');
    render(<DocumentBody location={window.location} pageContext={mockPageContext} />);
    // use `queryBy` to avoid throwing an error with `getBy`
    const footer = screen.queryByTestId('consistent-footer');
    expect(footer).not.toBeInTheDocument();

    const feedbackWidget = screen.queryByText(constants.text.feedbackButton);
    expect(feedbackWidget).not.toBeInTheDocument();

    const mainNav = screen.queryByRole('img', { name: 'MongoDB logo' });
    expect(mainNav).not.toBeInTheDocument();
  });
});

//TODO: Write the test for SideNav
describe('DefaultLayout', () => {});
