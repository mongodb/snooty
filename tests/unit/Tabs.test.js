import React from 'react';
import { mount, shallow } from 'enzyme';
import Tabs from '../../src/components/Tabs';

// data for this component
import mockDataPlatforms from './data/Tabs-platform.test.json';
import mockDataLanguages from './data/Tabs-languages.test.json';
import mockDataHidden from './data/Tabs-hidden.test.json';

const context = {
  activeTabs: {},
  setActiveTab: jest.fn(),
};

// TODO: Update commented-out tests to make use of Enzyme support for React Context after it has been implemented.
// GitHub issue: https://github.com/airbnb/enzyme/issues/1959
const mountTabs = ({ mockData, mockAddTabset }) =>
  mount(<Tabs nodeData={mockData} addTabset={mockAddTabset} />, { context });

const shallowTabs = ({ mockData, mockAddTabset }) =>
  shallow(<Tabs nodeData={mockData} addTabset={mockAddTabset} />, { context });

describe('Tabs testing', () => {
  describe('Tab unit tests', () => {
    let wrapper;
    const mockAddTabset = jest.fn();

    beforeAll(() => {
      wrapper = mountTabs({
        mockData: mockDataPlatforms,
        mockAddTabset,
      });
    });

    it('tabs container exists with correct number of children', () => {
      const tabCount = wrapper.props().nodeData.children.length;
      expect(wrapper.find('.tab-strip')).toHaveLength(1);
      expect(wrapper.find('.tab-strip__element').exists()).toEqual(true);
      expect(wrapper.find('.tab-strip__element')).toHaveLength(tabCount);
    });

    it('added tabset on component load', () => {
      expect(mockAddTabset.mock.calls.length).toBe(1);
    });

    // TODO: Update with context support
    /* it('active tab is set in DOM', () => {
      wrapper.setContext({ activeTabs: { platforms: PLATFORMS[0] } });
      expect(wrapper.find('.tab-strip__element[aria-selected="true"]').exists()).toEqual(true);
    }); */

    // TODO: Update with context support
    /* it('active tab is correct value', () => {
      expect(wrapper.context().activeTabs.platforms).toEqual(PLATFORMS[0]);
    }); */

    it('exists non-active tab', () => {
      expect(wrapper.find('.tab-strip__element[aria-selected="false"]').exists()).toEqual(true);
    });

    // TODO: Update with context support
    /* it('clicking new non-active tab calls function', () => {
      const nonactiveTab = wrapper.find('.tab-strip__element[aria-selected="false"]').first();
      nonactiveTab.simulate('click');
      expect(wrapper.context().setActiveTab.mock.calls.length).toBe(1);
    }); */
  });

  describe('Drivers unit tests', () => {
    let wrapper;
    const mockAddTabset = jest.fn();

    beforeAll(() => {
      wrapper = mountTabs({
        mockData: mockDataLanguages,
        mockAddTabset,
      });
    });

    it('tabset should not be created for drivers/language pills', () => {
      expect(wrapper.find('.tab-strip__element').exists()).toEqual(false);
    });
  });

  describe('when a hidden tabset is passed in', () => {
    let wrapper;
    const mockAddTabset = jest.fn();

    beforeAll(() => {
      wrapper = shallowTabs({
        mockData: mockDataHidden,
        mockAddTabset,
      });
    });

    it('does not render a tabset', () => {
      expect(wrapper.find('.tab-strip')).toHaveLength(0);
    });
  });

  describe('when javascript is disabled', () => {
    let wrapper;
    const mockAddTabset = jest.fn();
  
    beforeAll(() => {
      wrapper = shallowTabs({
        mockData: mockDataPlatforms,
        mockAddTabset,
      });
    });

    it('renders tabs in the set', () => {
      expect(wrapper.find('.tab-strip')).toHaveLength(1);
    });
  });
});

