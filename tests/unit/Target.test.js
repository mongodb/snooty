import React from 'react';
import { render } from 'enzyme';
import Target from '../../src/components/Target';

// data for this component
import mockData from './data/Target.test.json';

it('renders correctly with a directive_argument node', () => {
  const tree = render(<Target nodeData={mockData.a} />);
  expect(tree).toMatchSnapshot();
});

it('renders correctly with no directive_argument nodes', () => {
  const tree = render(<Target nodeData={mockData.b} />);
  expect(tree).toMatchSnapshot();
});
