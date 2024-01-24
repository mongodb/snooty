import React from 'react';
import { render } from '@testing-library/react';
import Instruqt from '../../src/components/Instruqt';
// data for this component
import mockData from './data/Instruqt.test.json';

describe('Instruqt', () => {
  beforeEach(() => {
    process.env.GATSBY_FEATURE_LAB_DRAWER = false;
  });

  it('renders null when directive argument does not exist', () => {
    const wrapper = render(<Instruqt nodeData={mockData.noArgument} />);
    expect(wrapper.queryByTitle('Instruqt', { exact: false })).toBeFalsy();
  });

  it('renders as embedded content', () => {
    const wrapper = render(<Instruqt nodeData={mockData.example} />);
    expect(wrapper.queryByTitle('Instruqt', { exact: false })).toBeTruthy();
  });

  describe('lab drawer', () => {
    it('renders in a drawer', () => {
      // This may be removed as the feature work is complete
      process.env.GATSBY_FEATURE_LAB_DRAWER = true;
      const wrapper = render(<Instruqt nodeData={mockData.example} />);
      expect(wrapper.queryByTitle('Instruqt', { exact: false })).toBeTruthy();
      expect(wrapper.queryByText('MongoDB Interactive Lab')).toBeTruthy();
    });
  });
});
