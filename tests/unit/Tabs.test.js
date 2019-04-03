import React from 'react';
import { mount } from 'enzyme';
import { PLATFORMS } from '../../src/constants';
import Tabs from '../../src/components/Tabs';

// data for this component
import mockData from './data/Tabs.test.json';

const mountTabs = ({ mockSetActiveTab, activeTabs }) =>
  mount(<Tabs nodeData={mockData} addTabset={mockSetActiveTab} setActiveTab={mockSetActiveTab} activeTabs={activeTabs} />);

describe('Tabs testing', () => {
  describe('Tabs selection', () => {
    let wrapper;
    const mockSetActiveTab = jest.fn();

    beforeAll(() => {
      wrapper = mountTabs({ mockSetActiveTab, activeTabs: { platforms: PLATFORMS[0] } });
    });

    it('tabs container exists with correct number of children', () => {
      const tabCount = wrapper.props().nodeData.children.length;
      expect(wrapper.find('.tab-strip__element').exists()).toEqual(true);
      expect(wrapper.find('.tab-strip__element')).toHaveLength(tabCount);
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
      mockSetActiveTab.mockClear();
      const nonactiveTab = wrapper.find('.tab-strip__element[aria-selected="false"]').first();
      nonactiveTab.simulate('click');
      expect(mockSetActiveTab.mock.calls.length).toBe(1);
    });
  });
});
