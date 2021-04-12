import React from 'react';
import { shallow } from 'enzyme';
import Breadcrumbs from '../../src/components/Breadcrumbs';

import mockData from './data/Breadcrumbs.test.json';

it('renders correctly', () => {
  const tree = shallow(<Breadcrumbs parentPaths={mockData} siteTitle="MongoDB Compass" slug="documents/view" />);
  expect(tree).toMatchSnapshot();
});

it('fails gracefully', () => {
  const tree = shallow(<Breadcrumbs parentPaths={null} siteTitle="untitled" slug="/" />);
  expect(tree).toMatchSnapshot();
});
