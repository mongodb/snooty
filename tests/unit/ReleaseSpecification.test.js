import React from 'react';
import { render } from 'enzyme';
import ReleaseSpecification from '../../src/components/ComponentFactory/ReleaseSpecification';

// data for this component
import mockData from './data/ReleaseSpecification.test.json';

it('renders correctly', () => {
  const tree = render(<ReleaseSpecification nodeData={mockData} />);
  expect(tree).toMatchSnapshot();
});
