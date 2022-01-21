import React from 'react';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Pills from '../../src/components/Pills';
import { TabContext } from '../../src/components/tab-context';
import { PLATFORMS } from '../../src/constants';

const renderPills = ({ activeTabs, mockData, mockSetActiveTab }) =>
  render(
    <TabContext.Provider value={{ activeTabs, setActiveTab: mockSetActiveTab }}>
      <Pills pills={mockData} />
    </TabContext.Provider>
  );

describe('Pills component', () => {
  const mockData = ['windows', 'macos', 'linux'];
  const mockSetActiveTab = jest.fn();

  it('renders correctly', () => {
    const wrapper = renderPills({
      activeTabs: { platforms: PLATFORMS[1] },
      mockData,
      mockSetActiveTab,
    });
    expect(wrapper.asFragment()).toMatchSnapshot();
  });

  it('clicking a pill calls the event handler', () => {
    const wrapper = renderPills({
      activeTabs: { platforms: PLATFORMS[1] },
      mockData,
      mockSetActiveTab,
    });
    userEvent.click(wrapper.queryAllByRole('button')[0]);
    expect(mockSetActiveTab.mock.calls.length).toBe(1);
  });
});
