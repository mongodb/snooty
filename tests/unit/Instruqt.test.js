import React from 'react';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Instruqt from '../../src/components/Instruqt';
import { InstruqtProvider } from '../../src/components/Instruqt/instruqt-context';
import Heading from '../../src/components/Heading';
import mockData from './data/Instruqt.test.json';

const mockTitleHeading = {
  children: [
    {
      type: 'text',
      value: 'Title Heading',
    },
  ],
  id: 'title-heading',
};

const renderComponent = (nodeData, hasLabDrawer = false) => {
  return render(
    <InstruqtProvider hasLabDrawer={hasLabDrawer}>
      <Heading sectionDepth={1} nodeData={mockTitleHeading} />
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
    const hasLabDrawer = true;
    jest.useFakeTimers();
    // Default width and height of Jest's virtual DOM/window
    const defaultWindowWidth = global.window.innerWidth;
    const defaultWindowHeight = global.window.innerHeight;

    beforeEach(() => {
      process.env.GATSBY_FEATURE_LAB_DRAWER = 'true';
    });

    const openLabDrawer = (wrapper) => {
      const expectedButtonText = 'Open Interactive Tutorial';
      const drawerButton = wrapper.getByText(expectedButtonText);
      expect(drawerButton).toBeTruthy();
      // LG buttons require us to check for closest button
      userEvent.click(drawerButton.closest('button'));
    };

    it('renders in a drawer', () => {
      const wrapper = renderComponent(mockData.example, hasLabDrawer);
      openLabDrawer(wrapper);

      // Ensure everything exists
      const drawerContainer = wrapper.getByTestId('resizable-wrapper');
      expect(drawerContainer).toBeTruthy();
      expect(drawerContainer).toHaveStyle(`width: ${defaultWindowWidth}px`);
      expect(drawerContainer).toHaveStyle(`height: ${(defaultWindowHeight * 2) / 3}px`);
      expect(wrapper.queryByTitle('Instruqt', { exact: false })).toBeTruthy();
    });

    it('can be minimized and brought back to starting height', () => {
      const wrapper = renderComponent(mockData.example, hasLabDrawer);
      openLabDrawer(wrapper);
      const drawerContainer = wrapper.getByTestId('resizable-wrapper');
      // Label text based on aria labels for LG Icons
      const minimizeButton = wrapper.getByLabelText('Minus Icon');
      const startingDrawerHeight = (defaultWindowHeight * 2) / 3;
      expect(drawerContainer).toHaveStyle(`height: ${startingDrawerHeight}px`);

      // Ensure height goes down
      userEvent.click(minimizeButton);
      expect(drawerContainer).toHaveStyle(`width: ${defaultWindowWidth}px`);
      expect(drawerContainer).toHaveStyle(`height: 60px`);

      // Ensure height goes back up to starting height
      const arrowUpButton = wrapper.getByLabelText('Arrow Up Icon');
      userEvent.click(arrowUpButton);
      expect(drawerContainer).toHaveStyle(`width: ${defaultWindowWidth}px`);
      expect(drawerContainer).toHaveStyle(`height: ${startingDrawerHeight}px`);
    });

    it('can set height to maximum', () => {
      const wrapper = renderComponent(mockData.example, hasLabDrawer);
      openLabDrawer(wrapper);
      const drawerContainer = wrapper.getByTestId('resizable-wrapper');
      const fullscreenEnterButton = wrapper.getByLabelText('Full Screen Enter Icon');
      const startingDrawerHeight = (defaultWindowHeight * 2) / 3;
      expect(drawerContainer).toHaveStyle(`height: ${startingDrawerHeight}px`);

      // Ensure drawer height goes up to max height
      userEvent.click(fullscreenEnterButton);
      expect(drawerContainer).toHaveStyle(`width: ${defaultWindowWidth}px`);
      expect(drawerContainer).toHaveStyle(`height: ${defaultWindowHeight}px`);

      // Ensure drawer height goes back down to starting height
      const fullscreenExitButton = wrapper.getByLabelText('Full Screen Exit Icon');
      userEvent.click(fullscreenExitButton);
      expect(drawerContainer).toHaveStyle(`width: ${defaultWindowWidth}px`);
      expect(drawerContainer).toHaveStyle(`height: ${startingDrawerHeight}px`);
    });

    it('can be closed', () => {
      const wrapper = renderComponent(mockData.example, hasLabDrawer);
      openLabDrawer(wrapper);
      const xButton = wrapper.getByLabelText('X Icon');
      expect(wrapper.queryByTestId('resizable-wrapper')).toBeTruthy();

      userEvent.click(xButton);
      expect(wrapper.queryByTestId('resizable-wrapper')).toBeFalsy();
    });
  });
});
