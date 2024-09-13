import React from 'react';
import { render } from '@testing-library/react';
import { mockLocation } from '../utils/mock-location';
import { InternalPageNav } from '../../src/components/InternalPageNav';
import useSnootyMetadata from '../../src/utils/use-snooty-metadata';
import { PageContext } from '../../src/context/page-context';
import slugToBreadcrumbLabel from './data/ecosystem/slugToBreadcrumbLabel.json';

const data = ['drivers/csharp', 'drivers/go', 'drivers/java', 'drivers/motor', 'drivers/cxx'];

jest.mock(`../../src/utils/use-snooty-metadata`, () => jest.fn());

const renderNav = (slug) =>
  render(
    <PageContext.Provider value={{ slug }}>
      <InternalPageNav slug={slug} slugTitleMapping={slugToBreadcrumbLabel} toctreeOrder={data} />
    </PageContext.Provider>
  );

beforeAll(() => {
  mockLocation(null, `/`);
  useSnootyMetadata.mockImplementation(() => ({}));
});

it('renders a page with next and previous links correctly', () => {
  const tree = renderNav('drivers/go');
  expect(tree.asFragment()).toMatchSnapshot();
});

it('renders a page with no previous link correctly', () => {
  const tree = renderNav('drivers/csharp');
  expect(tree.asFragment()).toMatchSnapshot();
});

it('renders a page with no next link correctly', () => {
  const tree = renderNav('drivers/cxx');
  expect(tree.asFragment()).toMatchSnapshot();
});

describe('multi-page tutorials', () => {
  it('renders a page with next and previous page steps', () => {
    const mockData = ['drivers/csharp', 'drivers/java', 'drivers/cxx'];
    useSnootyMetadata.mockImplementation(() => ({
      multiPageTutorials: {
        'mock-page': {
          slugs: mockData,
          total_steps: mockData.length,
        },
      },
      slugToBreadcrumbLabel,
    }));

    const tree = renderNav('drivers/go');
    expect(tree.asFragment()).toMatchSnapshot();
  });

  it('renders a page with next in multi-page tutorial, and previous toctree order', () => {
    const mockData = ['drivers/go', 'drivers/motor'];
    useSnootyMetadata.mockImplementation(() => ({
      multiPageTutorials: {
        'mock-page': {
          slugs: mockData,
          total_steps: mockData.length,
        },
      },
      slugToBreadcrumbLabel,
    }));

    const tree = renderNav('drivers/go');
    expect(tree.asFragment()).toMatchSnapshot();
  });

  it('renders a page with previous in multi-page tutorial, and next toctree order', () => {
    const mockData = ['drivers/go', 'drivers/motor'];
    useSnootyMetadata.mockImplementation(() => ({
      multiPageTutorials: {
        'mock-page': {
          slugs: mockData,
          total_steps: mockData.length,
        },
      },
      slugToBreadcrumbLabel,
    }));

    const tree = renderNav('drivers/motor');
    expect(tree.asFragment()).toMatchSnapshot();
  });
});
