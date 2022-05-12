import React from 'react';
import { render } from '@testing-library/react';
import Field from '../../src/components/FieldList/Field';

// data for this component
import mockData from './data/FieldList.test.json';

it('renders correctly', () => {
  const tree = render(<Field nodeData={mockData.children[0]} />);
  expect(tree.asFragment()).toMatchSnapshot();
});
