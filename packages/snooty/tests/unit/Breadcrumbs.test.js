import React from 'react';
import * as Gatsby from 'gatsby';
import { render } from '@testing-library/react';
import Breadcrumbs from '../../src/components/Breadcrumbs/index';
import useSnootyMetadata from '../../src/utils/use-snooty-metadata';

import { mockWithPrefix } from '../utils/mock-with-prefix';
import mockData from './data/Breadcrumbs.test.json';

jest.mock(`../../src/utils/use-snooty-metadata`, () => jest.fn());

beforeAll(() => {
  useSnootyMetadata.mockImplementation(() => ({
    project: 'test-project',
    parentPaths: mockData,
  }));
});

const mockIntermediateCrumbs = [
  {
    title: 'MongoDB Atlas',
    path: 'https://www.mongodb.com/docs/atlas/',
  },
];
const useStaticQuery = jest.spyOn(Gatsby, 'useStaticQuery');

//add propertyUrl and breadcrumbs
useStaticQuery.mockImplementation(() => ({
  allBreadcrumb: {
    nodes: [
      {
        project: 'test-project',
        breadcrumbs: mockIntermediateCrumbs,
        propertyUrl: 'https://www.mongodb.com/docs/atlas/device-sdks/',
      },
    ],
  },
  site: {
    siteMetadata: {
      siteUrl: 'https://www.mongodb.com/',
    },
  },
}));

mockWithPrefix('/docs/atlas/device-sdks');

it('renders correctly with siteTitle', () => {
  const tree = render(<Breadcrumbs siteTitle={'Atlas Device SDKs'} slug={'sdk/cpp/app-services/call-a-function'} />);
  expect(tree.asFragment()).toMatchSnapshot();
});

it('renders correctly as a homepage', () => {
  const tree = render(<Breadcrumbs siteTitle={'Atlas Device SDKs'} slug={'/'} />);
  expect(tree.asFragment()).toMatchSnapshot();
});
