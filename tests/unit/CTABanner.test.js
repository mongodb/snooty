import React from 'react';
import { render } from '@testing-library/react';
import CTABanner from '../../src/components/Banner/CTABanner';

// data for this component
import mockData from './data/CTABanner.test.json';

it('renders a CTABanner correctly', () => {
  const wrapper = render(<CTABanner nodeData={mockData} />);
  expect(wrapper.asFragment()).toMatchSnapshot();
});
