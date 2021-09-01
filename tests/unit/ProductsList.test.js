import React from 'react';
import { mount } from 'enzyme';
import { matchers } from 'jest-emotion';
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

const expectComponentIsOpen = (wrapper, value) => {
  expect(wrapper.find('ProductsListHeading').prop('isOpen')).toEqual(value);
};

describe('ProductsList', () => {
  jest.useFakeTimers();

  it('renders closed', async () => {
    const wrapper = mount(<ProductsList />);
    expectComponentIsOpen(wrapper, false);
    // Products still technically render, but should be displayed as none
    const productsList = wrapper.find('Products');
    expect(productsList.childAt(0).children()).toHaveLength(2);
    expect(productsList).toHaveStyleRule('display', 'none');
  });

  it('opens on click', async () => {
    const wrapper = mount(<ProductsList />);
    wrapper.find('ProductsListHeading').simulate('click');
    await tick({ wrapper });
    // Check for the state since this should control which css is applied at which state
    expectComponentIsOpen(wrapper, true);
  });
});
