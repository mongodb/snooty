import '@testing-library/jest-dom';
import { preloadAll } from 'react-loadable';
import { useLocation } from '@gatsbyjs/reach-router';
import { mockLeafyGreenIds, resetLeafyGreenIdCounter, restoreLeafyGreenIds } from './utils/mock-leafygreen-ids';
import { mockWindows } from './utils/mock-windows';

jest.mock('@gatsbyjs/reach-router', () => ({
  useLocation: jest.fn().mockImplementation(() => ({
    hash: '',
  })),
  navigate: jest.fn(),
  globalHistory: {
    listen: jest.fn(),
  },
}));

export const mockLocation = (search, pathname) => useLocation.mockImplementation(() => ({ search, pathname }));

global.navigator = {
  userAgent: 'node.js',
};

class MockResizeObserver {}
['observe', 'unobserve', 'disconnect'].forEach((method) => {
  MockResizeObserver.prototype[method] = jest.fn();
});

global.ResizeObserver = MockResizeObserver;

jest.mock('@leafygreen-ui/lib', () => {
  const lib = jest.requireActual('@leafygreen-ui/lib');
  return {
    ...lib,
    createUniqueClassName: () => 'constant-classname',
  };
});

const rejectionHandler = (err) => {
  console.error('Unhandled Promise Rejection'); // eslint-disable-line no-console
  throw err;
};

// Reset ID counter before each test for consistency
beforeEach(() => {
  resetLeafyGreenIdCounter();

  // Reset URL via History API so jsdom's real Location object is preserved
  window.history.replaceState({}, '', '/');
  // Clear hash to a consistent default
  if (window.location.hash) {
    window.location.hash = '';
  }
});

beforeAll(async () => {
  mockLeafyGreenIds();
  mockWindows();
  await preloadAll();
  process.on('unhandledRejection', rejectionHandler);
});

afterAll(() => {
  process.removeListener('unhandledRejection', rejectionHandler);
  restoreLeafyGreenIds();
});

const crypto = require('crypto');

Object.defineProperty(global.self, 'crypto', {
  value: {
    getRandomValues: (arr) => crypto.randomBytes(arr.length),
  },
});

global.fetch = jest.fn();
window.crypto.randomUUID = crypto.randomUUID;
