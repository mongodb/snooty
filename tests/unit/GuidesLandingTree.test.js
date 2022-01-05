import React from 'react';
import { shallow } from 'enzyme';
import mockData from './data/Chapters.test.json';
import GuidesLandingTree from '../../src/components/Sidenav/GuidesLandingTree';

const getWrapper = () => {
  const { chapters } = mockData.metadata;

  return shallow(<GuidesLandingTree chapters={chapters} />);
};

it('renders correctly', () => {
  const wrapper = getWrapper();
  expect(wrapper).toMatchSnapshot();
});
