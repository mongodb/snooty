import { act } from 'react-dom/test-utils';
import { Context as ResponsiveContext } from 'react-responsive';

export async function tick({ waitFor = 0, wrapper } = {}) {
  await act(async () => {
    jest.advanceTimersByTime(waitFor);
  });
  if (wrapper) {
    wrapper.update();
  }
}

export function mockMutationObserver() {
  global.MutationObserver = class {
    disconnect() {}
    observe(element, initObject) {}
  };
}

export function mockSegmentAnalytics() {
  window.analytics = {
    user: jest.fn(() => ({
      id: jest.fn(() => 'test-id-please-ignore'),
    })),
  };
}

export function withScreenSize(size) {
  const screenSizes = {
    // Simulate a 1920px x 1080px desktop monitor
    desktop: { width: 1920, height: 1080 },
    // Simulate a 10.5" iPad Pro (1668px x 2224px @ 2x scale)
    'ipad-pro': { width: 834, height: 1112 },
    // Simulate an iPhone X (1125px x 2436px @ 3x scale)
    'iphone-x': { width: 375, height: 812 },
  };
  return {
    wrappingComponent: ResponsiveContext.Provider,
    wrappingComponentProps: { value: screenSizes[size] },
  };
}
