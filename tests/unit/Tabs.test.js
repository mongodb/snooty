import React from 'react';
import { mount } from 'enzyme';
import { PLATFORMS } from '../../src/constants';
import Tabs from '../../src/components/Tabs';

// data for this component
import mockData from './data/Tabs.test.json';

const mountTabs = ({ activeTabs, mockCallback }) =>
  mount(<Tabs nodeData={mockData} addTabset={mockCallback} setActiveTab={mockCallback} activeTabs={activeTabs} />);

describe('Tabs testing', () => {
  describe('Tabs selection', () => {
    let wrapper;
    const mockCallback = jest.fn();

    beforeAll(() => {
      wrapper = mountTabs({ mockCallback, activeTabs: { platforms: PLATFORMS[0] } });
    });

    it('tabs container exists', () => {
      expect(wrapper.find('.tab-strip__element').exists()).toEqual(true);
    });

    it('active tab is set', () => {
      expect(wrapper.find('.tab-strip__element[aria-selected="true"]').exists()).toEqual(true);
    });

    it('exists non-active tab', () => {
      expect(wrapper.find('.tab-strip__element[aria-selected="false"]').exists()).toEqual(true);
    });

    it('clicking new non-active tab calls function', () => {
      mockCallback.mockClear();
      const nonactiveTab = wrapper.find('.tab-strip__element[aria-selected="false"]').first();
      nonactiveTab.simulate('click');
      expect(mockCallback.mock.calls.length).toBe(1);
    });
  });
});
