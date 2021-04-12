import React from 'react';
import * as Gatsby from 'gatsby';
import { mount } from 'enzyme';
import { act } from 'react-dom/test-utils';
import ProductsList from '../../src/components/ProductsList';
import * as StitchUtil from '../../src/utils/stitch';
import { tick } from '../utils';

const useStaticQuery = jest.spyOn(Gatsby, 'useStaticQuery');

const mockStaticQuery = () => {
  useStaticQuery.mockImplementation(() => ({
    site: {
      siteMetadata: {
        database: 'snooty_dev',
      },
    },
  }));
};

const mockProducts = [
  {
    baseUrl: 'https://www.docs.mongodb.com/',
    slug: 'drivers/',
    title: 'MongoDB Drivers',
  },
  {
    baseUrl: 'https://www.docs.atlas.mongodb.com/',
    slug: '',
    title: 'MongoDB Atlas',
  },
];

const mockClient = {
  auth: {
    loginWithCredential: jest.fn(() => {
      return new Promise((resolve) => resolve());
    }),
  },
  callFunction: jest.fn(() => Promise.resolve(mockProducts)),
};

describe('ProductsList', () => {
  jest.useFakeTimers();

  it('renders with products', async () => {
    jest.spyOn(StitchUtil, 'getStitchClient').mockImplementation(() => mockClient);
    let wrapper;
    mockStaticQuery();

    await act(async () => {
      wrapper = mount(<ProductsList />);
    });
    expect(wrapper).toMatchSnapshot();

    await act(async () => {
      wrapper.find('ProductsListHeading').simulate('click');
      await tick({ wrapper });
    });

    const products = wrapper.find('a');
    expect(products).toHaveLength(2);
    expect(products.at(0).props()).toHaveProperty('href', 'https://www.docs.mongodb.com/drivers/');
    expect(products.at(0).children().text()).toEqual('MongoDB Drivers');
    expect(products.at(1).props()).toHaveProperty('href', 'https://www.docs.atlas.mongodb.com/');
    expect(products.at(1).children().text()).toEqual('MongoDB Atlas');
  });
});
