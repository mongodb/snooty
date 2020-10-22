import React from 'react';
import { mount, shallow } from 'enzyme';
import Tabs from '../../src/components/Tabs';
import { TabProvider } from '../../src/components/tab-context';

// data for this component
import mockDataPlatforms from './data/Tabs-platform.test.json';
import mockDataLanguages from './data/Tabs-languages.test.json';
import mockDataHidden from './data/Tabs-hidden.test.json';
import mockDataAnonymous from './data/Tabs-anonymous.test.json';

const mountTabs = ({ activeTabs, mockData }) => {
  return mount(
    <TabProvider>
      <Tabs nodeData={mockData} />
    </TabProvider>
  );
};

const shallowTabs = ({ mockData, mockAddTabset }) =>
  shallow(
    <TabProvider>
      <Tabs nodeData={mockData} addTabset={mockAddTabset} />
    </TabProvider>
  );

describe('Tabs testing', () => {
  describe('Tab unit tests', () => {
    let wrapper;
    const mockAddTabset = jest.fn();

    beforeAll(() => {
      wrapper = mountTabs({
        mockData: mockDataAnonymous,
      });
    });

    it('tabs container exists with correct number of children', () => {
      const tabCount = wrapper.childAt(0).props().nodeData.children.length;
      expect(wrapper.find('.tab-strip')).toHaveLength(1);
      expect(wrapper.find('.tab-strip__element').exists()).toEqual(true);
      expect(wrapper.find('.tab-strip__element')).toHaveLength(tabCount);
    });

    it('did not call mockAddTabset for a non-guides tabset', () => {
      expect(mockAddTabset.mock.calls.length).toBe(0);
    });

    it('active tab is set in DOM', () => {
      expect(wrapper.find('.tab-strip__element[aria-selected=true]').exists()).toEqual(true);
    });

    it('exists non-active tab', () => {
      expect(wrapper.find('.tab-strip__element[aria-selected=false]').exists()).toEqual(true);
    });
  });

  describe('Ecosystem unit tests', () => {
    let wrapper;

    beforeAll(() => {
      process.env = Object.assign(process.env, { GATSBY_SITE: 'ecosystem' });
      wrapper = mountTabs({
        mockData: mockDataLanguages,
      });
    });

    it('tabset should be created for drivers/language pills', () => {
      expect(wrapper.find('.tab-strip__element').exists()).toEqual(true);
    });
  });

  describe('when a hidden tabset is passed in', () => {
    let wrapper;

    beforeAll(() => {
      wrapper = shallowTabs({
        mockData: mockDataHidden,
      });
    });

    it('does not render a tabset', () => {
      expect(wrapper.find('.tab-strip')).toHaveLength(0);
    });
  });

  describe('when javascript is disabled', () => {
    let wrapper;

    beforeAll(() => {
      wrapper = mountTabs({
        mockData: mockDataPlatforms,
      });
    });

    it('renders tabs in the set', () => {
      expect(wrapper.find('.tab-strip')).toHaveLength(1);
    });
  });
});
