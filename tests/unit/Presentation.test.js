import React from 'react';
import { render, screen, act } from '@testing-library/react';
import * as Gatsby from 'gatsby';
import { mockLocation } from '../utils/mock-location';
import DocumentBody from '../../src/components/DocumentBody';
import mockPageContext from './data/PageContext.test.json';
import mockSnootyMetadata from './data/SnootyMetadata.json';

jest.mock(`../../src/utils/use-snooty-metadata`, () => {
  return () => mockSnootyMetadata;
});

const useStaticQuery = jest.spyOn(Gatsby, 'useStaticQuery');
useStaticQuery.mockImplementation(() => ({
  site: {
    siteMetadata: {
      commitHash: '',
      parserBranch: '',
      patchId: '',
      pathPrefix: '',
      snootyBranch: '',
      user: '',
      snootyEnv: 'production',
    },
  },
}));

describe('DocumentBody', () => {
  beforeAll(() => {
    jest.spyOn(document, 'querySelector');
  });

  it('renders the necessary elements at base path', async () => {
    await act(async () => {
      mockLocation(null, '/docs', '', 'https://www.mongodb.com/docs');
      render(<DocumentBody location={window.location} pageContext={mockPageContext} />);
    });
    const footer = await screen.findByTestId('consistent-footer');
    expect(footer).toBeVisible();
    expect(footer).toMatchSnapshot();

    const languageSelector = await screen.findByTestId('options');
    expect(languageSelector).toBeInTheDocument();

    const mainNav = await screen.findByRole('img', { name: 'MongoDB logo' });
    expect(mainNav).toBeVisible();
    expect(mainNav).toMatchSnapshot();
  });

  it('renders the necessary elements at project path', async () => {
    await act(async () => {
      mockLocation(
        null,
        '/docs/drivers/community-supported-drivers',
        '',
        'https://www.mongodb.com/docs/drivers/community-supported-drivers'
      );
      render(<DocumentBody location={window.location} pageContext={mockPageContext} />);
    });
    const footer = await screen.findByTestId('consistent-footer');
    expect(footer).toBeVisible();
    expect(footer).toMatchSnapshot();

    const languageSelector = await screen.findByTestId('options');
    expect(languageSelector).toBeInTheDocument();

    const mainNav = await screen.findByRole('img', { name: 'MongoDB logo' });
    expect(mainNav).toBeVisible();
    expect(mainNav).toMatchSnapshot();
  });

  it('does not render the following elements, footer, navigation', async () => {
    mockLocation('?presentation=true');
    render(<DocumentBody location={window.location} pageContext={mockPageContext} />);
    // use `queryBy` to avoid throwing an error with `getBy`
    const footer = screen.queryByTestId('consistent-footer');
    expect(footer).not.toBeInTheDocument();

    const mainNav = screen.queryByRole('img', { name: 'MongoDB logo' });
    expect(mainNav).not.toBeInTheDocument();
  });
});

//TODO: Write the test for SideNav
describe('DefaultLayout', () => {});
