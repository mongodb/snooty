import React from 'react';
import { render } from 'enzyme';
import DefinitionList from '../../src/components/DefinitionList';
import mockData from './data/DefinitionList.test.json';

it('DefinitionList renders correctly', () => {
  const tree = render(<DefinitionList nodeData={mockData} />);
  expect(tree).toMatchSnapshot();
});
