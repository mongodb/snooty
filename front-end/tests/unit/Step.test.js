import React from 'react';
import { shallow } from 'enzyme';
import Step from '../../src/components/Step';

// data for this component
import mockData from './data/Step.test.json';

it('renders correctly', () => {
  const tree = shallow(<Step nodeData={mockData} />);
  expect(tree).toMatchSnapshot();
});
