import React from 'react';
import { act } from 'react-dom/test-utils';
import { render } from '@testing-library/react';
import useViewport, { getViewport } from '../../src/hooks/useViewport';
import { tick } from '../utils';

const TestComponent = () => {
  const { width, height, scrollX, scrollY } = useViewport();
  return (
    <>
      <input type="number" data-testid="#width" value={width} />
      <input type="number" data-testid="#height" value={height} />
      <input type="number" data-testid="#scrollX" value={scrollX} />
      <input type="number" data-testid="#scrollY" value={scrollY} />
    </>
  );
};

describe('getViewport()', () => {
  it('returns the current viewport', () => {
    const { width, height, scrollX, scrollY } = getViewport();
    expect(width).toEqual(1024);
    expect(height).toEqual(768);
    expect(scrollX).toEqual(0);
    expect(scrollY).toEqual(0);
  });
});

describe('useViewport()', () => {
  jest.useFakeTimers();

  let listeners;
  let addEventListener;
  let removeEventListener;
  beforeEach(() => {
    listeners = {};
    window.innerWidth = 1024;
    window.innerHeight = 768;
    window.pageXOffset = 0;
    window.pageYOffset = 0;
    addEventListener = window.addEventListener;
    window.addEventListener = jest.fn((event, cb) => {
      listeners[event] = cb;
    });
    removeEventListener = window.removeEventListener;
    window.removeEventListener = jest.fn((event, cb) => {
      delete listeners[event];
    });
  });
  afterEach(() => {
    window.addEventListener = addEventListener;
    window.removeEventListener = removeEventListener;
  });

  function resize(width = global.window.innerWidth, height = global.window.innerHeight) {
    const resizeEvent = document.createEvent('Event');
    resizeEvent.initEvent('resize', true, true);

    global.window.innerWidth = width || global.window.innerWidth;
    global.window.innerHeight = height || global.window.innerHeight;
    global.window.dispatchEvent(resizeEvent);
    act(() => {
      listeners.resize();
    });
  }

  function scroll(vertical = 0, horizontal = 0) {
    const scrollEvent = document.createEvent('Event');
    scrollEvent.initEvent('scroll', true, true);

    global.window.pageYOffset = global.window.pageYOffset + vertical;
    global.window.pageXOffset = global.window.pageXOffset + horizontal;
    global.window.dispatchEvent(scrollEvent);
    act(() => {
      listeners.scroll();
    });
  }

  it('properly adds and removes event listeners', () => {
    const getAddResizeListenerCalls = () => window.addEventListener.mock.calls.filter((c) => c[0] === 'resize');
    const getAddScrollListenerCalls = () => window.addEventListener.mock.calls.filter((c) => c[0] === 'scroll');
    const getRemoveResizeListenerCalls = () => window.removeEventListener.mock.calls.filter((c) => c[0] === 'resize');
    const getRemoveScrollListenerCalls = () => window.removeEventListener.mock.calls.filter((c) => c[0] === 'scroll');

    expect(getAddResizeListenerCalls().length).toBe(0);
    expect(getAddScrollListenerCalls().length).toBe(0);

    const wrapper = render(<TestComponent />);
    expect(getAddResizeListenerCalls().length).toBe(1);
    expect(getAddScrollListenerCalls().length).toBe(1);
    expect(getRemoveResizeListenerCalls().length).toBe(0);
    expect(getRemoveScrollListenerCalls().length).toBe(0);

    wrapper.unmount();
    expect(getAddResizeListenerCalls().length).toBe(1);
    expect(getAddScrollListenerCalls().length).toBe(1);
    expect(getRemoveResizeListenerCalls().length).toBe(1);
    expect(getRemoveScrollListenerCalls().length).toBe(1);
  });

  it('updates the viewport on scroll', async () => {
    const wrapper = render(<TestComponent />);

    expect(wrapper.getByTestId('#scrollX')).toHaveValue(0);
    expect(wrapper.getByTestId('#scrollY')).toHaveValue(0);

    scroll(40, 10);
    await tick({ waitFor: 200 });

    expect(wrapper.getByTestId('#scrollX')).toHaveValue(10);
    expect(wrapper.getByTestId('#scrollY')).toHaveValue(40);
  });

  it('updates the viewport on resize', async () => {
    const wrapper = render(<TestComponent />);

    expect(wrapper.getByTestId('#width')).toHaveValue(1024);
    expect(wrapper.getByTestId('#height')).toHaveValue(768);

    resize(800, 670);
    await tick({ waitFor: 200 });

    expect(wrapper.getByTestId('#width')).toHaveValue(800);
    expect(wrapper.getByTestId('#height')).toHaveValue(670);
  });

  it('debounces the event listeners for 200ms', async () => {
    const wrapper = render(<TestComponent />);

    expect(wrapper.getByTestId('#width')).toHaveValue(1024);
    expect(wrapper.getByTestId('#height')).toHaveValue(768);

    // Resize the window
    resize(800, 670);

    // Before 200ms the viewport values shouldn't update
    await tick({ waitFor: 199 });
    expect(wrapper.getByTestId('#width')).toHaveValue(1024);
    expect(wrapper.getByTestId('#height')).toHaveValue(768);

    // After 200ms the viewport values should update
    await tick({ waitFor: 1 });
    expect(wrapper.getByTestId('#width')).toHaveValue(800);
    expect(wrapper.getByTestId('#height')).toHaveValue(670);

    // Now let's make sure that the debounce waits 200ms from the most recent scroll event
    resize(900, 535);
    await tick({ waitFor: 100 });

    resize(1000, 400);
    await tick({ waitFor: 100 });

    // 200ms have passed since the original resize
    // The second resize reset the debounce interval, so nothing should change yet
    expect(wrapper.getByTestId('#width')).toHaveValue(800);
    expect(wrapper.getByTestId('#height')).toHaveValue(670);

    await tick({ waitFor: 100 });

    // It's now 300ms since the first resize and 200ms since the second resize
    // After 200ms without another resize event, the second resize updates the viewport values
    expect(wrapper.getByTestId('#width')).toHaveValue(1000);
    expect(wrapper.getByTestId('#height')).toHaveValue(400);
  });
});
