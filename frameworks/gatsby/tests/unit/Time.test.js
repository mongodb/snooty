import React from 'react';
import { render } from '@testing-library/react';
import Time from '../../src/components/Time';
import mockData from './data/Time.test.json';

it('renders correctly', () => {
  const wrapper = render(<Time nodeData={mockData} />);
  expect(wrapper.getByText('Time required: 15 minutes')).toBeTruthy();
});
