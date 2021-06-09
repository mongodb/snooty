import React from 'react';
import { shallow } from 'enzyme';
import StepYAML from '../../src/components/StepYAML';

// data for this component
import mockData from './data/Step.test.json';

it('renders correctly', () => {
  const tree = shallow(<StepYAML nodeData={mockData} />);
  expect(tree).toMatchSnapshot();
});
