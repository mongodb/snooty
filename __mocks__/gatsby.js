const React = require('react');

const gatsby = jest.requireActual('gatsby');

module.exports = {
  ...gatsby,
  graphql: jest.fn(),
  navigate: jest.fn(),
  StaticQuery: jest.fn(),
  withPrefix: jest.fn().mockImplementation((path) => (path.startsWith(`/`) ? path : `/${path}`)),
  useStaticQuery: jest.fn(),
  // https://www.gatsbyjs.org/docs/unit-testing/
  Link: jest.fn().mockImplementation(
    // these props are invalid for an `a` tag
    ({ activeClassName, activeStyle, getProps, innerRef, partiallyActive, ref, replace, to, ...rest }) =>
      React.createElement('a', {
        ...rest,
        href: to,
      })
  ),
};
