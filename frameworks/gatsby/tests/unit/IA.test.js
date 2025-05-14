import React from 'react';
import { render } from '@testing-library/react';
// Keep mockLocation on top to ensure mock is applied
import { mockLocation } from '../utils/mock-location';
import IA from '../../src/components/Sidenav/IA';
import useSnootyMetadata from '../../src/utils/use-snooty-metadata';
import sampleData from './data/IA.test.json';

jest.mock(`../../src/utils/use-snooty-metadata`, () => jest.fn());

beforeAll(() => {
  mockLocation(null, `/`);
});

it('renders a simple page IA correctly', () => {
  useSnootyMetadata.mockImplementation(() => ({}));
  const tree = render(<IA ia={sampleData.pageIA} />);
  expect(tree.asFragment()).toMatchSnapshot();
});

it('renders a page IA with IA linked data', () => {
  useSnootyMetadata.mockImplementation(() => sampleData.iaTreeMetadata);
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
