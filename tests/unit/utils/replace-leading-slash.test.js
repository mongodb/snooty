import { replaceLeadingSlash } from '../../../src/utils/replace-leading-slash';

it('should replace leading slashes to file pathnames if found', () => {
  const pathNameWithSlash = '/path/to/image.png';

  const pathNameWithMultipleSlashes = '////path/to/image.png';

  const pathNameWithoutSlash = 'path/to/image.png';

  expect(replaceLeadingSlash(pathNameWithSlash)).toBe(pathNameWithoutSlash);
  expect(replaceLeadingSlash(pathNameWithMultipleSlashes)).toBe(pathNameWithoutSlash);
  expect(replaceLeadingSlash(pathNameWithoutSlash)).toBe(pathNameWithoutSlash);
});
