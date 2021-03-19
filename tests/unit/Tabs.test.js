import React from 'react';
import { mount, shallow } from 'enzyme';
import Tabs from '../../src/components/Tabs';
import { TabProvider } from '../../src/components/tab-context';
import { theme } from '../../src/theme/docsTheme';

// data for this component
import mockDataPlatforms from './data/Tabs-platform.test.json';
import mockDataLanguages from './data/Tabs-languages.test.json';
import mockDataHidden from './data/Tabs-hidden.test.json';
import mockDataAnonymous from './data/Tabs-anonymous.test.json';
import { ThemeProvider } from 'emotion-theming';

const mountTabs = ({ mockData }) => {
  return mount(
    <ThemeProvider theme={theme}>
      <TabProvider>
        <Tabs nodeData={mockData} />
      </TabProvider>
    </ThemeProvider>
  )
    .childAt(0)
    .childAt(0)
    .childAt(0);
};

const shallowTabs = ({ mockData, mockAddTabset }) =>
  shallow(
    <TabProvider>
      <Tabs nodeData={mockData} addTabset={mockAddTabset} />
    </TabProvider>
  )
    .childAt(0)
    .childAt(0);

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
      const tabCount = mockDataAnonymous.children.length;
      expect(wrapper.find('Tabs')).toHaveLength(1);
      expect(wrapper.find('Tab').exists()).toEqual(true);
      expect(wrapper.find('Tab')).toHaveLength(tabCount);
    });

    it('did not call mockAddTabset for a non-guides tabset', () => {
      expect(mockAddTabset.mock.calls.length).toBe(0);
    });

    it('active tab is set in DOM', () => {
      expect(
        wrapper
          .find('Tab')
          .first()
          .prop('selected')
      ).toEqual(true);
    });

    it('exists non-active tab', () => {
      expect(
        wrapper
          .find('Tab')
          .at(1)
          .prop('selected')
      ).toEqual(false);
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
      expect(wrapper.find('Tabs').exists()).toEqual(true);
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
      expect(wrapper.find('Tabs')).toHaveLength(0);
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
      expect(wrapper.find('Tabs')).toHaveLength(1);
    });
  });
});
