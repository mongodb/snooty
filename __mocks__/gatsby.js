const gatsby = jest.requireActual('gatsby');

module.exports = {
  ...gatsby,
  graphql: jest.fn(),
  StaticQuery: jest.fn(),
  withPrefix: jest.fn().mockImplementation(str => str),
  useStaticQuery: jest.fn(),
};
