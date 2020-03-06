import React from 'react';
import { act } from 'react-dom/test-utils';
import { mount } from 'enzyme';
import useViewport, { getViewport } from '../../src/hooks/useViewport';

const TestComponent = () => {
  const { width, height, scrollX, scrollY } = useViewport();
  return (
    <>
      <div id="width" value={width} />
      <div id="height" value={height} />
      <div id="scrollX" value={scrollX} />
      <div id="scrollY" value={scrollY} />
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
    jest.runAllTimers();
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
    jest.runAllTimers();
  }

  it('properly adds and removes event listeners', () => {
    const getAddResizeListenerCalls = () => window.addEventListener.mock.calls.filter(c => c[0] === 'resize');
    const getAddScrollListenerCalls = () => window.addEventListener.mock.calls.filter(c => c[0] === 'scroll');
    const getRemoveResizeListenerCalls = () => window.removeEventListener.mock.calls.filter(c => c[0] === 'resize');
    const getRemoveScrollListenerCalls = () => window.removeEventListener.mock.calls.filter(c => c[0] === 'scroll');

    expect(getAddResizeListenerCalls().length).toBe(0);
    expect(getAddScrollListenerCalls().length).toBe(0);

    const wrapper = mount(<TestComponent />);
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

  it('updates the viewport on scroll', () => {
    const wrapper = mount(<TestComponent />);
    expect(wrapper.find('#width').prop('value')).toEqual(1024);
    expect(wrapper.find('#height').prop('value')).toEqual(768);
    expect(wrapper.find('#scrollX').prop('value')).toEqual(0);
    expect(wrapper.find('#scrollY').prop('value')).toEqual(0);

    scroll(40, 10);
    wrapper.update();

    expect(wrapper.find('#width').prop('value')).toEqual(1024);
    expect(wrapper.find('#height').prop('value')).toEqual(768);
    expect(wrapper.find('#scrollX').prop('value')).toEqual(10);
    expect(wrapper.find('#scrollY').prop('value')).toEqual(40);
  });

  it('updates the viewport on resize', () => {
    const wrapper = mount(<TestComponent />);
    expect(wrapper.find('#width').prop('value')).toEqual(1024);
    expect(wrapper.find('#height').prop('value')).toEqual(768);
    expect(wrapper.find('#scrollX').prop('value')).toEqual(0);
    expect(wrapper.find('#scrollY').prop('value')).toEqual(0);

    resize(800, 670);
    wrapper.update();

    expect(wrapper.find('#width').prop('value')).toEqual(800);
    expect(wrapper.find('#height').prop('value')).toEqual(670);
    expect(wrapper.find('#scrollX').prop('value')).toEqual(0);
    expect(wrapper.find('#scrollY').prop('value')).toEqual(0);
  });
});
