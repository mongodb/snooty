import React from 'react';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Lightbox from '../../src/components/Figure/Lightbox';
// data for this component
import mockData from './data/Figure.test.json';

describe('Lightbox', () => {
  it('renders correctly', () => {
    const wrapper = render(<Lightbox nodeData={mockData} />);
    expect(wrapper.asFragment()).toMatchSnapshot();
  });

  it('displays lightbox image and prompt', () => {
    const wrapper = render(<Lightbox nodeData={mockData} />);
    expect(wrapper.getByText('click to enlarge')).toBeTruthy();
    expect(wrapper.getByAltText('test-alt')).toBeTruthy();
  });

  it('does not display the modal', () => {
    const wrapper = render(<Lightbox nodeData={mockData} />);
    expect(wrapper.queryAllByRole('dialog').length).toBe(0);
  });

  it('clicking the photo opens the modal', () => {
    const wrapper = render(<Lightbox nodeData={mockData} />);
    userEvent.click(wrapper.getByRole('button'));
    expect(wrapper.getByRole('dialog')).toBeTruthy();
  });
});
