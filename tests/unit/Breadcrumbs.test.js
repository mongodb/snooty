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
    parentPaths: mockData,
  }));
});

const mockIntermediateCrumbs = [
  {
    title: 'MongoDB Atlas',
    url: '/docs/atlas',
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
}));

it('renders correctly with siteTitle', () => {
  const tree = render(
    <Breadcrumbs siteTitle="Call a Function - C++ SDK" slug="sdk/cpp/app-services/call-a-function" />
  );
  expect(tree.asFragment()).toMatchSnapshot();
});

it('renders correctly with pageTitle', () => {
  const tree = render(
    <Breadcrumbs
      pageTitle={'Call a Function - C++ SDK'}
      siteTitle={'MongoDB Documentation'}
      slug={'sdk/cpp/app-services/call-a-function'}
    />
  );
  expect(tree.asFragment()).toMatchSnapshot();
});
