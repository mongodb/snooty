import React from 'react';
import { render, screen } from '@testing-library/react';
import { LocationProvider, createHistory } from '@reach/router';
import mockStaticQuery from '../utils/mockStaticQuery';
import DocumentBody from '../../src/components/DocumentBody';
import mockPageContext from './data/PageContext.test.json';
import mockSnootyMetadata from './data/SnootyMetadata.json';

let history;

beforeAll(() => {
  mockStaticQuery({}, mockSnootyMetadata);
});

describe('DocumentBody', () => {
  describe('render elements', () => {
    beforeEach(() => {
      history = createHistory(window);

      render(
        <LocationProvider history={history}>
          <DocumentBody location={window.location} pageContext={mockPageContext} />
        </LocationProvider>
      );
    });

    it('renders the footer', () => {
      const footer = screen.getByTestId('consistent-footer');
      expect(footer).toBeVisible();
    });

    it('feedback widget', () => {
      const feedbackWidget = screen.getByText('Share Feedback');
      expect(feedbackWidget).toBeVisible();
    });

    it('render navigation', () => {
      const mainNav = screen.getByRole('img', { name: 'MongoDB logo' });
      expect(mainNav).toBeVisible();
    });
  });

  describe('not render elements', () => {
    beforeEach(() => {
      Object.defineProperty(window, 'location', {
        value: {
          search: '?presentation=true',
        },
      });
      history = createHistory(window);

      render(
        <LocationProvider history={history}>
          <DocumentBody location={window.location} pageContext={mockPageContext} />
        </LocationProvider>
      );
    });
    it('does not render the footer', () => {
      // use `queryBy` to avoid throwing an error with `getBy`
      const footer = screen.queryByTestId('consistent-footer');
      expect(footer).not.toBeInTheDocument();
    });

    it('does not render feedback widget', () => {
      const feedbackWidget = screen.queryByTestId('Share Feedback');
      expect(feedbackWidget).not.toBeInTheDocument();
    });

    it('does not render navigation', () => {
      const mainNav = screen.queryByRole('img', { name: 'MongoDB logo' });
      expect(mainNav).not.toBeInTheDocument();
    });
  });
});

//TODO: Write the test for SideNav
describe('DefaultLayout', () => {});
