/* global afterAll, beforeAll */
const Enzyme = require('enzyme'); // eslint-disable-line import/no-extraneous-dependencies
const Adapter = require('enzyme-adapter-react-16'); // eslint-disable-line import/no-extraneous-dependencies
const Loadable = require('react-loadable');

Enzyme.configure({ adapter: new Adapter() });

global.navigator = {
  userAgent: 'node.js',
};

const rejectionHandler = err => {
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
