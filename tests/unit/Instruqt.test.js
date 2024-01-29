import React from 'react';
import { render } from '@testing-library/react';
import Instruqt from '../../src/components/Instruqt';
// data for this component
import { InstruqtProvider } from '../../src/components/Instruqt/instruqt-context';
import mockData from './data/Instruqt.test.json';

const renderComponent = (nodeData, hasLabDrawer = false) => {
  return render(
    <InstruqtProvider hasInstruqtLab={hasLabDrawer}>
      <Instruqt nodeData={nodeData} />
    </InstruqtProvider>
  );
};

describe('Instruqt', () => {
  beforeEach(() => {
    process.env.GATSBY_FEATURE_LAB_DRAWER = false;
  });

  it('renders null when directive argument does not exist', () => {
    const wrapper = renderComponent(mockData.noArgument);
    expect(wrapper.queryByTitle('Instruqt', { exact: false })).toBeFalsy();
  });

  it('renders as embedded content', () => {
    const wrapper = renderComponent(mockData.example);
    expect(wrapper.queryByTitle('Instruqt', { exact: false })).toBeTruthy();
  });

  describe('lab drawer', () => {
    it('renders in a drawer', () => {
      // This may be removed as the feature work is complete
      process.env.GATSBY_FEATURE_LAB_DRAWER = true;
      const hasLabDrawer = true;
      const wrapper = renderComponent(mockData.example, hasLabDrawer);
      expect(wrapper.queryByTitle('Instruqt', { exact: false })).toBeTruthy();
      expect(wrapper.queryByText('MongoDB Interactive Lab')).toBeTruthy();
    });
  });
});
