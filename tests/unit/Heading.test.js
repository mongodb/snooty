import React from 'react';
import { render } from 'enzyme';
import Heading from '../../src/components/ComponentFactory/Heading';

// data for this component
import mockData from './data/Heading.test.json';

it('renders correctly', () => {
  const tree = render(<Heading nodeData={mockData} sectionDepth={3} />);
  expect(tree).toMatchSnapshot();
});
