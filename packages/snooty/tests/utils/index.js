import { act } from 'react-dom/test-utils';
import { theme } from '../../src/theme/docsTheme';

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

const {
  screenSize: { largeAndUp, upToLarge, upToSmall },
} = theme;

export const setMatchMedia = (...queries) => {
  window.matchMedia = (media) => ({
    addEventListener: () => {},
    removeEventListener: () => {},
    addListener: () => {},
    removeListener: () => {},
    matches: queries.some((query) => media === query),
  });
};

export const setMobile = () => {
  setMatchMedia(upToSmall, upToLarge);
};

export const setTablet = () => {
  setMatchMedia(upToLarge);
};

export const setDesktop = () => {
  setMatchMedia(largeAndUp);
};
