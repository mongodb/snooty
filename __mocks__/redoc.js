// Mock redoc library by default to avoid nested import error in RedocStandalone component
// import * as YAML from './dist/index.js'
module.exports = {
  RedocStandalone: jest.fn(),
};
