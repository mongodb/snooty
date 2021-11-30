import React from 'react';
import { mount, shallow } from 'enzyme';
import Pills from '../../src/components/Pills';
import { TabContext } from '../../src/components/ComponentFactory/Tabs/tab-context';
import { PLATFORMS } from '../../src/constants';

const mountPills = ({ activeTabs, mockData, mockSetActiveTab }) =>
  mount(
    <TabContext.Provider value={{ activeTabs, setActiveTab: mockSetActiveTab }}>
      <Pills pills={mockData} />
    </TabContext.Provider>
  );
const shallowPills = ({ mockData }) => shallow(<Pills pills={mockData} />);

describe('Pills component', () => {
  let wrapper;
  let shallowWrapper;
  const mockData = ['windows', 'macos', 'linux'];
  const mockSetActiveTab = jest.fn();

  beforeAll(() => {
    wrapper = mountPills({
      activeTabs: { platforms: PLATFORMS[1] },
      mockData,
      mockSetActiveTab,
    });
    shallowWrapper = shallowPills({ mockData });
  });

  it('renders correctly', () => {
    expect(shallowWrapper).toMatchSnapshot();
  });

  it('clicking a pill calls the event handler', () => {
    wrapper.find('.guide__pill').first().simulate('click');
    expect(mockSetActiveTab.mock.calls.length).toBe(1);
  });
});
