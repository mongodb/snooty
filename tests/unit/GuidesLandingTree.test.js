import React from 'react';
import { render } from '@testing-library/react';
import mockData from './data/Chapters.test.json';
import GuidesLandingTree from '../../src/components/Sidenav/GuidesLandingTree';

const getWrapper = () => {
  const { chapters } = mockData.metadata;

  return render(<GuidesLandingTree chapters={chapters} />);
};

it('renders correctly', () => {
  const wrapper = getWrapper();
  expect(wrapper.asFragment()).toMatchSnapshot();
});
