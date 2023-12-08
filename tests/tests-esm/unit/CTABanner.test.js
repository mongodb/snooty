import React from 'react';
import { render } from '@testing-library/react';
import { mockLocation } from '../utils/mock-location';
import CTABanner from '../../src/components/Banner/CTABanner';

// data for this component
import mockData from './data/CTABanner.test.json';

beforeAll(() => {
  mockLocation(null, `/`);
});

it('renders a CTABanner correctly when non-default icon is specified', () => {
  const wrapper = render(<CTABanner nodeData={mockData.iconSpecified} />);
  expect(wrapper.getByRole('img')).toHaveAttribute('aria-label', 'University Icon');
  expect(wrapper.asFragment()).toMatchSnapshot();
});

it('renders a CTABanner correctly when no icon is specified', () => {
  const wrapper = render(<CTABanner nodeData={mockData.noIconSpecified} />);
  expect(wrapper.getByRole('img')).toHaveAttribute('aria-label', 'Play Icon');
  expect(wrapper.asFragment()).toMatchSnapshot();
});

it('renders a CTABanner correctly when invalid icon is specified', () => {
  const wrapper = render(<CTABanner nodeData={mockData.invalidIconSpecified} />);
  expect(wrapper.getByRole('img')).toHaveAttribute('aria-label', 'Play Icon');
  expect(wrapper.asFragment()).toMatchSnapshot();
});

it('renders a CTABanner correctly when lowercase icon is specified', () => {
  const wrapper = render(<CTABanner nodeData={mockData.lowercaseIconSpecified} />);
  expect(wrapper.getByRole('img')).toHaveAttribute('aria-label', 'Bell Icon');
  expect(wrapper.asFragment()).toMatchSnapshot();
});
