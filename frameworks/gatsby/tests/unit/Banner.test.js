import React from 'react';
import { render } from '@testing-library/react';
import Banner from '../../src/components/Banner/Banner';
import OfflineBanner from '../../src/components/Banner/OfflineBanner';

// data for this component
import mockData from './data/Banner.test.json';

it('renders a Banner correctly', () => {
  const wrapper = render(<Banner nodeData={mockData} />);
  expect(wrapper.asFragment()).toMatchSnapshot();
});

it('renders an offline banner correctly', () => {
  const wrapper = render(<OfflineBanner />);
  expect(wrapper.asFragment()).toMatchSnapshot();
});
