import React from 'react';
import * as Gatsby from 'gatsby';
import { render } from '@testing-library/react';
import { mockLocation } from '../utils/mock-location';
import Breadcrumbs from '../../src/components/Breadcrumbs/index';
import useSnootyMetadata from '../../src/utils/use-snooty-metadata';

import mockData from './data/Breadcrumbs.test.json';

jest.mock(`../../src/utils/use-snooty-metadata`, () => jest.fn());

beforeAll(() => {
  mockLocation(null, `/`);
  useSnootyMetadata.mockImplementation(() => ({
    project: 'test-project',
  }));
});

it('renders correctly with siteTitle', () => {
  const tree = render(<Breadcrumbs parentPaths={mockData} siteTitle="MongoDB Compass" slug="documents/view" />);
  expect(tree.asFragment()).toMatchSnapshot();
});

const useStaticQuery = jest.spyOn(Gatsby, 'useStaticQuery');
useStaticQuery.mockImplementation(() => ({
  site: {
    siteMetadata: {
      project: '',
    },
  },
  allProjectParent: {
    nodes: [],
  },
}));

it('renders correctly with pageTitle', () => {
  const tree = render(
    <Breadcrumbs
      pageTitle={'View & Analyze Data'}
      parentPaths={[]}
      siteTitle={'MongoDB Documentation'}
      slug={'view-analyze'}
    />
  );
  expect(tree.asFragment()).toMatchSnapshot();
});
