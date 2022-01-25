import React from 'react';
import { render } from '@testing-library/react';
import Banner from '../../src/components/Banner/Banner';

// data for this component
import mockData from './data/Banner.test.json';

it('renders a Banner correctly', () => {
  const wrapper = render(<Banner nodeData={mockData} />);
  expect(wrapper.asFragment()).toMatchSnapshot();
});
