import React from 'react';
import { render } from '@testing-library/react';
import mockData from './data/Time.test.json';
import Time from '../../src/components/Time';

it('renders correctly', () => {
  const wrapper = render(<Time nodeData={mockData} />);
  expect(wrapper.getByText('Time required: 15 minutes')).toBeTruthy();
});
