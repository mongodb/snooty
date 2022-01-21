import React from 'react';
import { render } from '@testing-library/react';
import DefinitionList from '../../src/components/DefinitionList';
import mockData from './data/DefinitionList.test.json';

it('DefinitionList renders correctly', () => {
  const tree = render(<DefinitionList nodeData={mockData} />);
  expect(tree.asFragment()).toMatchSnapshot();
});
