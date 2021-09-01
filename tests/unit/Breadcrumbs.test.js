import React from 'react';
import { shallow } from 'enzyme';
import Breadcrumbs from '../../src/components/Breadcrumbs';

import mockData from './data/Breadcrumbs.test.json';

it('renders correctly with siteTitle', () => {
  const tree = shallow(<Breadcrumbs parentPaths={mockData} siteTitle="MongoDB Compass" slug="documents/view" />);
  expect(tree).toMatchSnapshot();
});

it('renders correctly with pageTitle', () => {
  const tree = shallow(
    <Breadcrumbs
      pageTitle={'View & Analyze Data'}
      parentPaths={[]}
      siteTitle={'MongoDB Documentation'}
      slug={'view-analyze'}
    />
  );
  expect(tree).toMatchSnapshot();
});
