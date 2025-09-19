import React from 'react';
import { render } from '@testing-library/react';
import Banner from '../../src/components/Banner/Banner';
import OfflineBanner from '../../src/components/Banner/OfflineBanner';

// data for this component
import { getCurrLocale } from '../../src/utils/locale';
import mockData from './data/Banner.test.json';
// locale data for this component
import mockDataWithLocale from './data/BannerLocale.test.json';

jest.mock('../../src/utils/locale', () => ({
  getCurrLocale: jest.fn().mockReturnValue('en-US'),
}));

describe('Snapshots', () => {
  it('renders a Banner correctly', () => {
    const wrapper = render(<Banner nodeData={mockData} />);
    expect(wrapper.asFragment()).toMatchSnapshot();
  });

  it('renders a Banner correctly for a beta locale', () => {
    const wrapper = render(<Banner nodeData={mockDataWithLocale} />);
    expect(wrapper.asFragment()).toMatchSnapshot();
  });

  it('renders an offline banner correctly', () => {
    const wrapper = render(<OfflineBanner />);
    expect(wrapper.asFragment()).toMatchSnapshot();
  });
});

describe('Conditionally rendering banner as language callout', () => {
  it('Should NOT render banner if locale is not within the beta locale', () => {
    const { queryByRole } = render(<Banner nodeData={mockDataWithLocale} />);
    const banner = queryByRole('alert');
    expect(banner).not.toBeInTheDocument();
  });

  it('Should render banner if locale is a beta locale', () => {
    // Mock one of the beta locales
    getCurrLocale.mockReturnValue('es');
    const { getByRole } = render(<Banner nodeData={mockDataWithLocale} />);
    const banner = getByRole('alert');
    expect(banner).toBeVisible();
  });
});
