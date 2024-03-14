import { AVAILABLE_LANGUAGES, getLocaleMapping, localizePath } from '../../../src/utils/locale';

describe('getLocaleMapping', () => {
  it.each([
    ['https://www.mongodb.com/docs/', '/'],
    ['https://www.mongodb.com/docs', '/about/page/'],
    ['https://www.mongodb.com', 'introduction'],
  ])('returns a valid mapping of URLs', (siteUrl, slug) => {
    const mapping = getLocaleMapping(siteUrl, slug);
    expect(Object.keys(mapping)).toHaveLength(AVAILABLE_LANGUAGES.length);
    expect(mapping).toMatchSnapshot();
  });
});

describe('localizePath', () => {
  let windowSpy;

  beforeEach(() => {
    windowSpy = jest.spyOn(window, 'window', 'get');
  });

  afterEach(() => {
    windowSpy.mockRestore();
  });

  it.each([
    ['/', '/zh-cn/'],
    ['/page/slug', '/zh-cn/page/slug/'],
    ['page/slug', 'zh-cn/page/slug/'],
  ])('returns localized path when no code is set', (slug, expectedRes) => {
    // Pretend page exists on translated site
    windowSpy.mockImplementation(() => ({
      location: {
        pathname: '/zh-cn/docs-test/drivers/node/current',
      },
    }));
    const res = localizePath(slug);
    expect(res).toEqual(expectedRes);
  });

  it.each([
    ['/', 'ko-kr', '/ko-kr/'],
    ['/page/slug', 'pt-br', '/pt-br/page/slug/'],
    ['page/slug', 'zh-cn', 'zh-cn/page/slug/'],
  ])('returns localized path when code is set', (slug, code, expectedRes) => {
    const res = localizePath(slug, code);
    expect(res).toEqual(expectedRes);
  });

  it.each([
    ['/', '/'],
    ['/page/slug', '/page/slug/'],
    ['page/slug', 'page/slug/'],
  ])('returns the same page slug when English is found by default', (slug, expectedRes) => {
    const res = localizePath(slug);
    expect(res).toEqual(expectedRes);
  });

  it.each([
    ['/', '/'],
    ['/page/slug', '/page/slug/'],
    ['page/slug', 'page/slug/'],
  ])('gracefully defaults to English path when invalid language is passed in', (slug, expectedRes) => {
    const res = localizePath(slug, 'beep-boop');
    expect(res).toEqual(expectedRes);
  });
});
