import React from 'react';
import { render } from '@testing-library/react';
import FieldList from '../../src/components/FieldList';

// data for this component
import mockData from './data/FieldList.test.json';

it('renders correctly', () => {
  const tree = render(<FieldList nodeData={mockData} />);
  expect(tree.asFragment()).toMatchSnapshot();
});
