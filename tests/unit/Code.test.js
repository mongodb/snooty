import React from 'react';
import { shallow } from 'enzyme';
import Code from '../../src/components/Code';
import { TabContext } from '../../src/components/tab-context';

// data for this component
import mockData from './data/Code.test.json';

const shallowCode = ({ data, activeTabs }) => {
  return shallow(
    <TabContext.Provider value={{ activeTabs }}>
      <Code nodeData={data} />
    </TabContext.Provider>
  );
};

it('renders correctly', () => {
  const tree = shallowCode({ data: mockData, activeTabs: { cloud: 'cloud' } });
  expect(tree).toMatchSnapshot();
});

it('renders with javascript disabled correctly', () => {
  const tree = shallowCode({ data: mockData, activeTabs: {} });
  expect(tree).toMatchSnapshot();
});
