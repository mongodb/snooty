import React from 'react';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { matchers } from '@emotion/jest';
import { mockLocation } from '../utils/mock-location';
import ProductsList from '../../src/components/Sidenav/ProductsList';
import { tick } from '../utils';

const mockProducts = [
  {
    title: 'MongoDB Drivers',
    url: 'https://www.docs.mongodb.com/drivers/',
  },
  {
    title: 'MongoDB Atlas',
    url: 'https://www.docs.atlas.mongodb.com/',
  },
];

jest.mock('../../src/hooks/useAllProducts', () => ({
  useAllProducts: () => mockProducts,
}));

expect.extend(matchers);

beforeAll(() => {
  mockLocation(null, `/`);
});

describe('ProductsList', () => {
  jest.useFakeTimers();

  it('renders closed', async () => {
    const wrapper = render(<ProductsList />);
    // Products still technically render, but should be displayed as none
    const productsListEntry = wrapper.getByText(mockProducts[0].title);
    expect(productsListEntry).toBeTruthy();
    expect(productsListEntry).not.toBeVisible();
  });

  it('opens on click', async () => {
    const wrapper = render(<ProductsList />);
    userEvent.click(wrapper.getByText('View all products'));
    await tick();
    const productsListEntry = wrapper.getByText(mockProducts[0].title);
    // Check for the state since this should control which css is applied at which state
    expect(productsListEntry).toBeTruthy();
    expect(productsListEntry).toBeVisible();
  });
});
