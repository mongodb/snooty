import { AVAILABLE_LANGUAGES, getLocaleMapping } from '../../../src/utils/locale';

it.each([
  ['https://www.mongodb.com/docs/', '/'],
  ['https://www.mongodb.com/docs', '/about/page/'],
  ['https://www.mongodb.com', 'introduction'],
])('returns a valid mapping of URLs', (siteUrl, slug) => {
  const mapping = getLocaleMapping(siteUrl, slug);
  expect(Object.keys(mapping)).toHaveLength(AVAILABLE_LANGUAGES.length);
  expect(mapping).toMatchSnapshot();
});
