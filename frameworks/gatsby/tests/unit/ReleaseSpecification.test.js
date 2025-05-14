import React from 'react';
import { render } from '@testing-library/react';
import ReleaseSpecification from '../../src/components/ReleaseSpecification';

// data for this component
import mockData from './data/ReleaseSpecification.test.json';

it('renders correctly', () => {
  const tree = render(<ReleaseSpecification nodeData={mockData} />);
  expect(tree.asFragment()).toMatchSnapshot();
});
