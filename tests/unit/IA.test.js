import React from 'react';
import { render } from '@testing-library/react';
import IA from '../../src/components/Sidenav/IA';
import mockStaticQuery from '../utils/mockStaticQuery';
import sampleData from './data/IA.test.json';

it('renders a simple page IA correctly', () => {
  mockStaticQuery({}, {});
  const tree = render(<IA ia={sampleData.pageIA} />);
  expect(tree.asFragment()).toMatchSnapshot();
});

it('renders a page IA with IA linked data', () => {
  mockStaticQuery({}, sampleData.iaTreeMetadata);
  const mockIAData = [...sampleData.pageIA];
  // Programmatically add an ID for linked data, in case sample data order changes.
  for (const mockData of mockIAData) {
    if (mockData.title[0].value === 'Client Libraries') {
      mockData.id = 'client-libraries';
      break;
    }
  }
  const tree = render(<IA ia={mockIAData} />);
  expect(tree.asFragment()).toMatchSnapshot();
  // Explicitly check for a piece of linked data. The rest should be visible in
  // the snapshot.
  expect(tree.getByText('C++')).toBeTruthy();
});
