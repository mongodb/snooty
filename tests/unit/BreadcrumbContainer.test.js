import React from 'react';
import * as Gatsby from 'gatsby';
import { render } from '@testing-library/react';
import { mockLocation } from '../utils/mock-location';
import BreadcrumbContainer from '../../src/components/Breadcrumbs/BreadcrumbContainer';
import useSnootyMetadata from '../../src/utils/use-snooty-metadata';

const mountBreadcrumbContainer = (homeCrumb, lastCrumb) => {
  return render(<BreadcrumbContainer homeCrumb={homeCrumb} lastCrumb={lastCrumb} />);
};

const useStaticQuery = jest.spyOn(Gatsby, 'useStaticQuery');
jest.mock(`../../src/utils/use-snooty-metadata`, () => jest.fn());

beforeEach(() => {
  useSnootyMetadata.mockImplementation(() => ({
    project: 'test-project',
  }));
  mockLocation(null, `/`);
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
});

describe('BreadcrumbContainer', () => {
  const mockHomeCrumb = {
    title: 'Docs Home',
    url: 'https://www.mongodb.com/docs/',
  };

  it('renders correctly with project parent', () => {
    const mockLastCrumb = {
      title: 'MongoDB Compass',
      url: 'documents/view',
    };

    const mockParents = [
      {
        title: 'View & Analyze',
        url: 'https://www.mongodb.com/docs/view-analyze',
      },
    ];

    useStaticQuery.mockImplementation(() => ({
      site: {
        siteMetadata: {
          project: 'test-project',
        },
      },
      allProjectParent: {
        nodes: [
          {
            project: 'test-project',
            parents: mockParents,
          },
        ],
      },
    }));

    const tree = mountBreadcrumbContainer(mockHomeCrumb, mockLastCrumb);
    expect(tree.asFragment()).toMatchSnapshot();
  });

  it('renders correctly without project parent', () => {
    const mockLastCrumb = {
      title: 'View & Analyze Data',
      url: 'view-analyze',
    };

    const tree = mountBreadcrumbContainer(mockHomeCrumb, mockLastCrumb, []);
    expect(tree.asFragment()).toMatchSnapshot();
  });
});
