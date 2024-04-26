import React from 'react';
import * as Gatsby from 'gatsby';
import { render } from '@testing-library/react';
import { mockLocation } from '../utils/mock-location';
import BreadcrumbContainer from '../../src/components/Breadcrumbs/BreadcrumbContainer';
import useSnootyMetadata from '../../src/utils/use-snooty-metadata';
import mockData from './data/Breadcrumbs.test.json';

const mountBreadcrumbContainer = (homeCrumb, propertyCrumb, slug) => {
  return render(<BreadcrumbContainer homeCrumb={homeCrumb} propertyCrumb={propertyCrumb} slug={slug} />);
};

const useStaticQuery = jest.spyOn(Gatsby, 'useStaticQuery');

jest.mock(`../../src/utils/use-snooty-metadata`, () => jest.fn());

const mockIntermediateCrumbs = [
  {
    title: 'MongoDB Atlas',
    url: '/atlas/',
  },
];

//both tests have parentPaths, intermediate breadcrumb Atlas
beforeEach(() => {
  useSnootyMetadata.mockImplementation(() => ({
    project: 'test-project',
    parentPaths: mockData,
  }));
  mockLocation(null, `/`);
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
});

describe('BreadcrumbContainer', () => {
  //home breadcrumb
  const mockHomeCrumb = {
    title: 'Docs Home',
    url: 'https://www.mongodb.com/docs',
  };

  //property breadcrumb
  const mockPropertyCrumb = [
    {
      title: 'MongoDB Atlas Device SDKs',
      url: '/',
    },
  ];

  it('renders correctly with intermediate breadcrumb and with project parents', () => {
    useStaticQuery.mockImplementation(() => ({
      allBreadcrumb: {
        nodes: [
          {
            project: 'realm',
            breadcrumbs: mockIntermediateCrumbs,
            propertyUrl: 'https://www.mongodb.com/docs/atlas/device-sdks',
          },
        ],
      },
    }));

    const tree = mountBreadcrumbContainer(mockHomeCrumb, mockPropertyCrumb, 'sdk/cpp/app-services/call-a-function');
    expect(tree.asFragment()).toMatchSnapshot();
  });

  it('renders correctly with intermediate breadcrumb, has a slug but no project parents', () => {
    const tree = mountBreadcrumbContainer(mockHomeCrumb, mockPropertyCrumb, 'example-projects');
    expect(tree.asFragment()).toMatchSnapshot();
  });

  it('renders correctly as a docs property homepage', () => {
    const tree = mountBreadcrumbContainer(mockHomeCrumb, [], '');
    expect(tree.asFragment()).toMatchSnapshot();
  });
});
