import '@testing-library/jest-dom';

const Loadable = require('react-loadable');

global.navigator = {
  userAgent: 'node.js',
};

const rejectionHandler = (err) => {
  console.error('Unhandled Promise Rejection'); // eslint-disable-line no-console
  throw err;
};

beforeAll(async () => {
  await Loadable.preloadAll();
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
window.scrollTo = () => {};
