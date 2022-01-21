import React from 'react';
import * as Gatsby from 'gatsby';
import { render } from '@testing-library/react';
import Breadcrumbs from '../../src/components/Breadcrumbs';

import mockData from './data/Breadcrumbs.test.json';

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
