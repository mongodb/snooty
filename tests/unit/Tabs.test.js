import React from 'react';
import { mount } from 'enzyme';
import { PLATFORMS, LANGUAGES } from '../../src/constants';
import Tabs from '../../src/components/Tabs';

// data for this component
import mockDataPlatforms from './data/Tabs-platform.test.json';
import mockDataLanguages from './data/Tabs-languages.test.json';

const mountTabs = ({ mockData, mockSetActiveTab, mockAddTabset, activeTabs }) =>
  mount(<Tabs nodeData={mockData} setActiveTab={mockSetActiveTab} addTabset={mockAddTabset} activeTabs={activeTabs} />);

describe('Tabs testing', () => {
  describe('Tab unit tests', () => {
    let wrapper;
    const mockSetActiveTab = jest.fn();
    const mockAddTabset = jest.fn();

    beforeAll(() => {
      wrapper = mountTabs({ mockData: mockDataPlatforms, mockSetActiveTab, mockAddTabset, activeTabs: { platforms: PLATFORMS[0] } });
    });

    it('tabs container exists with correct number of children', () => {
      const tabCount = wrapper.props().nodeData.children.length;
      expect(wrapper.find('.tab-strip__element').exists()).toEqual(true);
      expect(wrapper.find('.tab-strip__element')).toHaveLength(tabCount);
    });

    it('added tabset on component load', () => {
      expect(mockAddTabset.mock.calls.length).toBe(1);
    });

    it('active tab is set in DOM', () => {
      expect(wrapper.find('.tab-strip__element[aria-selected="true"]').exists()).toEqual(true);
    });

    it('active tab is correct value', () => {
      expect(wrapper.props().activeTabs.platforms).toEqual(PLATFORMS[0]);
    });

    it('exists non-active tab', () => {
      expect(wrapper.find('.tab-strip__element[aria-selected="false"]').exists()).toEqual(true);
    });

    it('clicking new non-active tab calls function', () => {
      const nonactiveTab = wrapper.find('.tab-strip__element[aria-selected="false"]').first();
      nonactiveTab.simulate('click');
      expect(mockSetActiveTab.mock.calls.length).toBe(1);
    });
  });

  describe('Drivers unit tests', () => {
    let wrapper;
    const mockSetActiveTab = jest.fn();
    const mockAddTabset = jest.fn();

    beforeAll(() => {
      wrapper = mountTabs({ mockData: mockDataLanguages, mockSetActiveTab, mockAddTabset, activeTabs: { drivers: LANGUAGES[0] } });
    });

    it('tabset should not be created for drivers/language pills', () => {
      expect(wrapper.find('.tab-strip__element').exists()).toEqual(false)
    });
  });
});
