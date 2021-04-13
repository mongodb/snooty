import React from 'react';
import { mount } from 'enzyme';
import { matchers } from 'jest-emotion';
import ProductsList from '../../src/components/ProductsList';

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

describe('ProductsList', () => {
  it('renders with products', async () => {
    let wrapper = mount(<ProductsList />);
    expect(wrapper).toMatchSnapshot();

    // Display products list
    wrapper.find('ProductsListHeading').simulate('click');
    expect(wrapper.find('Products').props()).toHaveProperty('isOpen', true);
    expect(wrapper.find('Products')).not.toHaveStyleRule('display', 'none');
  });
});
