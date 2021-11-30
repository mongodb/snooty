import React from 'react';
import { shallow } from 'enzyme';
import StepYAML from '../../src/components/ComponentFactory/StepYAML';

// data for this component
import mockData from './data/StepYAML.test.json';

it('renders correctly', () => {
  const tree = shallow(<StepYAML nodeData={mockData} />);
  expect(tree).toMatchSnapshot();
});
