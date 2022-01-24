import React from 'react';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CodeIO from '../../src/components/Code/CodeIO';

// data for this component
import mockData from './data/CodeIO.test.json';

describe('CodeIO', () => {
  it('renders correctly', () => {
    const wrapper = render(<CodeIO nodeData={mockData} />);
    expect(wrapper.asFragment()).toMatchSnapshot();
  });

  it('opens and closes output code snippet when io toggle button is clicked', () => {
    const wrapper = render(<CodeIO nodeData={mockData} />);
    userEvent.click(wrapper.getByRole('button'));
    expect(wrapper.getByRole('outputShown')).toBeTruthy();
    userEvent.click(wrapper.getByRole('button'));
    const x = wrapper.queryAllByRole('outputShown');
    expect(x.length === 0);
  });
});
