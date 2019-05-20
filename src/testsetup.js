/* global afterAll, beforeAll */
const Enzyme = require('enzyme'); // eslint-disable-line import/no-extraneous-dependencies
const Adapter = require('enzyme-adapter-react-16'); // eslint-disable-line import/no-extraneous-dependencies
const Loadable = require('react-loadable');
const fs = require('fs');
const path = require('path');

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

const getSlugs = (dir, results) => {
  fs.readdirSync(dir).forEach(fileName => {
    const filePath = path.resolve(dir, fileName);
    const stat = fs.statSync(filePath);
    if (stat && stat.isDirectory()) {
      getSlugs(filePath, results);
    } else if (filePath.includes('index.html')) {
      if (filePath.match(new RegExp('public/(.*)/index.html'))) {
        results.push(filePath.match(new RegExp('public/(.*)/index.html'))[1]);
      }
    }
  });
  return results;
};

export const slugArray = getSlugs('./public', []);

window.scrollTo = () => {};
