export const mockWindows = () => {
  // Properly mock window.matchMedia to satisfy MediaQueryList interface
  window.matchMedia = (query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  });

  window.scrollTo = () => {};

  // Properly mock window.crypto to satisfy Crypto interface
  Object.defineProperty(window, 'crypto', {
    value: {
      randomUUID: crypto.randomUUID.bind(crypto),
      getRandomValues: crypto.getRandomValues.bind(crypto),
      subtle: crypto.subtle,
    },
  });
};
