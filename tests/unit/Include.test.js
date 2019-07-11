import React from 'react';
import { render } from 'enzyme';
import Include from '../../src/components/Include';

// data for this component
import mockData from './data/Include.test.json';
import mockIncludesMap from './data/includesMap.json';

it('renders correctly', () => {
  const tree = render(<Include nodeData={mockData} includes={mockIncludesMap} />);
  expect(tree).toMatchSnapshot();
});
