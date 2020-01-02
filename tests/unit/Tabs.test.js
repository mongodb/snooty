import React from 'react';
import { mount, shallow } from 'enzyme';
import Tabs from '../../src/components/Tabs';
import { TabContext } from '../../src/components/tab-context';

// data for this component
import mockDataPlatforms from './data/Tabs-platform.test.json';
import mockDataLanguages from './data/Tabs-languages.test.json';
import mockDataHidden from './data/Tabs-hidden.test.json';
import mockDataAnonymous from './data/Tabs-anonymous.test.json';

const context = {
  activeTabs: {},
  setActiveTab: jest.fn(),
};

// TODO: Update commented-out tests to make use of Enzyme support for React Context after it has been implemented.
// GitHub issue: https://github.com/airbnb/enzyme/issues/1959
const mountTabs = ({ activeTabs, mockData, mockAddTabset, mockSetActiveTab }) => {
  return mount(
    <TabContext.Provider value={{ activeTabs, setActiveTab: mockSetActiveTab }}>
      <Tabs nodeData={mockData} addTabset={mockAddTabset} />
    </TabContext.Provider>
  );
};

const shallowTabs = ({ mockData, mockAddTabset }) =>
  shallow(<Tabs nodeData={mockData} addTabset={mockAddTabset} />, { context });

describe('Tabs testing', () => {
  describe('Tab unit tests', () => {
    let wrapper;
    const mockSetActiveTab = jest.fn();
    const mockAddTabset = jest.fn();

    beforeAll(() => {
      wrapper = mountTabs({
        activeTabs: { 'list-view/table-view': 'table-view' },
        mockData: mockDataAnonymous,
        mockAddTabset,
        mockSetActiveTab,
      });
    });

    it('tabs container exists with correct number of children', () => {
      const tabCount = wrapper.props().nodeData.children.length;
      expect(wrapper.find('.tab-strip')).toHaveLength(1);
      expect(wrapper.find('.tab-strip__element').exists()).toEqual(true);
      expect(wrapper.find('.tab-strip__element')).toHaveLength(tabCount);
    });

    it('did not call mockAddTabset for a non-guides tabset', () => {
      expect(mockAddTabset.mock.calls.length).toBe(0);
    });

    it('active tab is set in DOM', () => {
      expect(wrapper.find('.tab-strip__element[aria-selected="true"]').exists()).toEqual(true);
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

  describe('Guides unit tests', () => {
    let wrapper;
    const mockSetActiveTab = jest.fn();
    const mockAddTabset = jest.fn();

    beforeAll(() => {
      process.env = Object.assign(process.env, { GATSBY_SITE: 'guides' });
      wrapper = mountTabs({
        activeTabs: {},
        mockData: mockDataLanguages,
        mockAddTabset,
        mockSetActiveTab,
      });
    });

    it('tabset should not be created for drivers/language pills', () => {
      expect(wrapper.find('.tab-strip__element').exists()).toEqual(false);
    });
  });

  describe('Ecosystem unit tests', () => {
    let wrapper;
    const mockSetActiveTab = jest.fn();
    const mockAddTabset = jest.fn();

    beforeAll(() => {
      process.env = Object.assign(process.env, { GATSBY_SITE: 'ecosystem' });
      wrapper = mountTabs({
        activeTabs: {},
        mockData: mockDataLanguages,
        mockAddTabset,
        mockSetActiveTab,
      });
    });

    it('tabset should be created for drivers/language pills', () => {
      expect(wrapper.find('.tab-strip__element').exists()).toEqual(true);
    });
  });

  describe('when a hidden tabset is passed in', () => {
    let wrapper;
    const mockSetActiveTab = jest.fn();
    const mockAddTabset = jest.fn();

    beforeAll(() => {
      wrapper = shallowTabs({
        activeTabs: {},
        mockData: mockDataHidden,
        mockAddTabset,
        mockSetActiveTab,
      });
    });

    it('does not render a tabset', () => {
      expect(wrapper.find('.tab-strip')).toHaveLength(0);
    });
  });

  describe('when javascript is disabled', () => {
    let wrapper;
    const mockAddTabset = jest.fn();
    const mockSetActiveTab = jest.fn();

    beforeAll(() => {
      wrapper = mountTabs({
        activeTabs: {},
        mockData: mockDataPlatforms,
        mockAddTabset,
        mockSetActiveTab,
      });
    });

    it('renders tabs in the set', () => {
      expect(wrapper.find('.tab-strip')).toHaveLength(1);
    });
  });
});
