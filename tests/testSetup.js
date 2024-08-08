import '@testing-library/jest-dom';
import EventSource from 'eventsourcemock';
import { preloadAll } from 'react-loadable';
import { useLocation } from '@gatsbyjs/reach-router';

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

beforeAll(async () => {
  await preloadAll();
  process.on('unhandledRejection', rejectionHandler);
});

afterAll(() => {
  process.removeListener('unhandledRejection', rejectionHandler);
});

const crypto = require('crypto');

Object.defineProperty(global.self, 'crypto', {
  value: {
    getRandomValues: (arr) => crypto.randomBytes(arr.length),
  },
});

window.matchMedia = () => ({ addListener: () => {}, removeListener: () => {} });
window.EventSource = () => ({ EventSource: EventSource });
window.scrollTo = () => {};
global.fetch = jest.fn();
window.crypto.randomUUID = crypto.randomUUID;
