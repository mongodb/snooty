import React from 'react';
import { render } from '@testing-library/react';
import { mockLocation } from '../utils/mock-location';
import Paragraph from '../../src/components/Paragraph';

// data for this component
import mockData from './data/Paragraph.test.json';
import mockDataFormat from './data/Paragraph-Format.test.json';

beforeAll(() => {
  mockLocation(null, `/`);
});

describe('Paragraph unit tests', () => {
  it('renders correctly', () => {
    const tree = render(<Paragraph nodeData={mockData} />);
    expect(tree.asFragment()).toMatchSnapshot();
  });

  it('handles formatting dangling punctuation after Links and no extra multiplying on rerenders', () => {
    const tree = render(<Paragraph nodeData={mockDataFormat} />);
    expect(tree.asFragment()).toMatchSnapshot();
    const treeRerender = render(<Paragraph nodeData={mockDataFormat} />);
    expect(treeRerender.asFragment()).toMatchSnapshot();
  });
});
