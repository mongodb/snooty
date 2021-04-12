import React from 'react';
import { mount } from 'enzyme';
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

describe('ProductsList', () => {
  it('renders with products', async () => {
    let wrapper = mount(<ProductsList />);
    expect(wrapper).toMatchSnapshot();

    // Show products list
    wrapper.find('ProductsListHeading').simulate('click');
    const products = wrapper.find('a');

    expect(products).toHaveLength(2);
    expect(products.at(0).props()).toHaveProperty('href', 'https://www.docs.mongodb.com/drivers/');
    expect(products.at(0).children().text()).toEqual('MongoDB Drivers');
    expect(products.at(1).props()).toHaveProperty('href', 'https://www.docs.atlas.mongodb.com/');
    expect(products.at(1).children().text()).toEqual('MongoDB Atlas');
  });
});
