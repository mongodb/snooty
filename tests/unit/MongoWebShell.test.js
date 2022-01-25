import React from 'react';
import { render } from '@testing-library/react';
import MongoWebShell from '../../src/components/MongoWebShell';

// data for this component
import mockDataDefault from './data/MongoWebShell-default.test.json';
import mockDataVersioned from './data/MongoWebShell-v4.2.test.json';

it('correctly renders a MongoDB Web Shell', () => {
  const tree = render(<MongoWebShell nodeData={mockDataDefault} />);
  expect(tree.asFragment()).toMatchSnapshot();
});

it('correctly renders a MongoDB Web Shell v4.2.9', () => {
  const tree = render(<MongoWebShell nodeData={mockDataVersioned} />);
  expect(tree.asFragment()).toMatchSnapshot();
});
