import React from 'react';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CodeIO from '../../src/components/Code/CodeIO';

// data for this component
import mockData from './data/CodeIO.test.json';

describe('CodeIO', () => {
  it('renders correctly', () => {
    const wrapper = render(<CodeIO nodeData={mockData.outputVisibleByDefault} />);
    expect(wrapper.asFragment()).toMatchSnapshot();
  });

  it('closes and opens output code snippet on io button click when output is visible by default', () => {
    const wrapper = render(<CodeIO nodeData={mockData.outputVisibleByDefault} />);
    userEvent.click(wrapper.getByRole('button'));
    expect(wrapper.getByText('hello world')).not.toBeVisible();
    userEvent.click(wrapper.getByRole('button'));
    expect(wrapper.getByText('hello world')).toBeVisible();
  });

  it('opens and closes output code snippet on io button click when output is hidden by default', () => {
    const wrapper = render(<CodeIO nodeData={mockData.outputHiddenByDefault} />);
    userEvent.click(wrapper.getByRole('button'));
    expect(wrapper.getByText('hello world')).toBeVisible();
    userEvent.click(wrapper.getByRole('button'));
    expect(wrapper.getByText('hello world')).not.toBeVisible();
  });
});
