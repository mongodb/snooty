import React from 'react';
import { render, screen } from '@testing-library/react';
import { mockLocation } from '../utils/mock-location';
import mockStaticQuery from '../utils/mockStaticQuery';
import DocumentBody from '../../src/components/DocumentBody';
import mockPageContext from './data/PageContext.test.json';
import mockSnootyMetadata from './data/SnootyMetadata.json';

beforeAll(() => {
  mockStaticQuery({}, mockSnootyMetadata);
});

describe('DocumentBody', () => {
  it('renders the necessary elements', () => {
    mockLocation(null);
    render(<DocumentBody location={window.location} pageContext={mockPageContext} />);

    const footer = screen.getByTestId('consistent-footer');
    expect(footer).toBeVisible();
    expect(footer).toMatchSnapshot();

    const feedbackWidget = screen.getByText('Share Feedback');
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

    const feedbackWidget = screen.queryByTestId('Share Feedback');
    expect(feedbackWidget).not.toBeInTheDocument();

    const mainNav = screen.queryByRole('img', { name: 'MongoDB logo' });
    expect(mainNav).not.toBeInTheDocument();
  });
});

//TODO: Write the test for SideNav
describe('DefaultLayout', () => {});
