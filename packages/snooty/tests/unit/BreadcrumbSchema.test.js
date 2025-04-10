import React from 'react';
import * as Gatsby from 'gatsby';
import { render } from '@testing-library/react';
import useSnootyMetadata from '../../src/utils/use-snooty-metadata';
import BreadcrumbSchema from '../../src/components/StructuredData/BreadcrumbSchema';
import { mockWithPrefix } from '../utils/mock-with-prefix';
import mockParents from './data/Breadcrumbs.test.json';

jest.mock(`../../src/utils/use-snooty-metadata`, () => jest.fn());

const mockIntermediateCrumbs = [
  {
    title: 'MongoDB Atlas',
    path: 'https://www.mongodb.com/docs/atlas',
  },
];

const useStaticQuery = jest.spyOn(Gatsby, 'useStaticQuery');
useStaticQuery.mockImplementation(() => ({
  site: {
    siteMetadata: {
      siteUrl: 'https://www.mongodb.com/',
    },
  },
  allBreadcrumb: {
    nodes: [
      {
        project: 'realm',
        breadcrumbs: mockIntermediateCrumbs,
        propertyUrl: 'https://www.mongodb.com/docs/atlas/device-sdks/',
      },
    ],
  },
}));

describe('BreadcrumbSchema', () => {
  beforeAll(() => {
    useSnootyMetadata.mockImplementation(() => ({
      parentPaths: mockParents,
    }));
    mockWithPrefix('/docs/atlas/device-sdks');
  });

  it('returns correct structured data with parents and intermediate breadcrumbs', () => {
    const { asFragment } = render(<BreadcrumbSchema slug={'sdk/cpp/app-services/call-a-function'} />);
    expect(asFragment()).toMatchSnapshot();
  });
});
