import React from 'react';
import { mount } from 'enzyme';
import Code from '../../src/components/Code';
import { TabContext } from '../../src/components/tab-context';

// data for this component
import mockData from './data/Code.test.json';

const mountCode = ({ data, activeTabs }) => {
  return mount(
    <TabContext.Provider value={{ activeTabs }}>
      <Code nodeData={data} />
    </TabContext.Provider>
  );
};

it('renders correctly', () => {
  const tree = mountCode({ data: mockData, activeTabs: { cloud: 'cloud' } });
  expect(tree).toMatchSnapshot();
});

it('renders with javascript disabled correctly', () => {
  const tree = mountCode({ data: mockData, activeTabs: {} });
  expect(tree).toMatchSnapshot();
});
