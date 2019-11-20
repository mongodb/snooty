import React from 'react';
import { shallow } from 'enzyme';
import Breadcrumbs from '../../src/components/Breadcrumbs';
import slugTitleMapping from './data/ecosystem-slugTitleMapping.json';

const mockData = ['drivers', 'drivers/php'];

it('renders correctly', () => {
  const tree = shallow(<Breadcrumbs parentPaths={mockData} slugTitleMapping={slugTitleMapping} />);
  expect(tree).toMatchSnapshot();
});

it('fails gracefully', () => {
  const tree = shallow(<Breadcrumbs parentPaths={null} slugTitleMapping={slugTitleMapping} />);
  expect(tree).toMatchSnapshot();
});
