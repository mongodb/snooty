import React from 'react';
import { render } from '@testing-library/react';
import MultiColumn from '../../src/components/MultiColumn';
// data for MultiComponent
import { ParentNode } from '../../src/types/ast';
import mockData from './data/MultiColumn.test.json';

const renderMultiColumn = () => render(<MultiColumn nodeData={mockData as ParentNode} />);

describe('Rendering a MultiComponent', () => {
  it('renders correct', () => {
    const wrapper = renderMultiColumn();
    expect(wrapper.asFragment()).toMatchSnapshot();
  });
});
