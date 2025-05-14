import { assertTrailingSlash } from '../../../src/utils/assert-trailing-slash';

it('should add trailing slashes to links if they are missing', () => {
  const linkWithoutSlash = 'foo.bar';
  const linkWithSlash = `${linkWithoutSlash}/`;
  expect(assertTrailingSlash(linkWithSlash)).toBe(linkWithSlash);

  // Should ignore anything without a slash
  expect(assertTrailingSlash(linkWithoutSlash)).toBe(linkWithSlash);

  // Should handle null/empty inputs
  expect(assertTrailingSlash('')).toBe('/');
});
