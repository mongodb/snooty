import redirectBasedOnLang from '../../../../src/utils/head-scripts/redirect-based-on-lang';
import { STORAGE_KEY_PREF_LOCALE } from '../../../../src/utils/locale';

const DEFAULT_SLUG = '/foo';

const defineWindowLocation = (value = {}) => {
  global.window = Object.create(window);
  Object.defineProperty(window, 'location', {
    value,
    // Allows tests to rewrite this object
    writable: true,
  });
};

const runFuncTest = (originalHref, expectedHref) => {
  // Destructure URL parts to help mock location
  const { hash, search, pathname } = new URL(originalHref, 'https://mongodb.com');
  defineWindowLocation({
    // Implementation detail: window.location.pathname should be defined since it won't be set if no redirect occurs
    // For testing purposes, we don't care about the base url, so we just use whatever the original pathname was
    pathname,
    hash,
    search,
  });

  redirectBasedOnLang();
  const resultingHref = window.location.pathname + window.location.search + window.location.hash;
  expect(resultingHref).toBe(expectedHref);
};

describe('redirectBasedOnLang', () => {
  let mockedBrowserLangs;
  let mockedLocalStorageGet;

  beforeAll(() => {
    mockedBrowserLangs = jest.spyOn(window.navigator, 'languages', 'get');
    // Mock storage prototype directly since tested function can't have imported dependencies
    mockedLocalStorageGet = jest.spyOn(Storage.prototype, 'getItem');
  });

  afterAll(() => {
    mockedBrowserLangs.mockClear();
    mockedLocalStorageGet.mockClear();
  });

  const mockPreferredLocale = (prefLocale) => {
    mockedLocalStorageGet.mockImplementationOnce((key) => {
      const store = {
        'mongodb-docs': {
          [STORAGE_KEY_PREF_LOCALE]: prefLocale,
        },
      };

      return JSON.stringify(store[key]) || null;
    });
  };

  it('redirects to first eligible browser language', () => {
    mockedBrowserLangs.mockReturnValue(['aa-aa', 'bb-bb', 'ko-kr', 'en-us']);
    runFuncTest(DEFAULT_SLUG, '/ko-kr' + DEFAULT_SLUG);
  });

  it('does not redirect when not on an English URL', () => {
    mockedBrowserLangs.mockReturnValue(['aa-aa', 'bb-bb', 'ko-kr', 'en-us']);
    const pathname = '/pt-br' + DEFAULT_SLUG;
    runFuncTest(pathname, pathname);
  });

  it('does not redirect when primary browser language is English', () => {
    mockedBrowserLangs.mockReturnValue(['en-us', 'ko-kr']);
    runFuncTest(DEFAULT_SLUG, DEFAULT_SLUG);
  });

  it('does not redirect when preferred locale is en-us', () => {
    mockedBrowserLangs.mockReturnValue(['aa-aa', 'bb-bb', 'ko-kr']);
    mockPreferredLocale('en-us');
    runFuncTest(DEFAULT_SLUG, DEFAULT_SLUG);
  });

  it('does not redirect when no language matches', () => {
    mockedBrowserLangs.mockReturnValue(['aa-aa', 'bb-bb']);
    runFuncTest(DEFAULT_SLUG, DEFAULT_SLUG);
  });

  it('ignores region', () => {
    // "en" should take precedence over "ko" here
    mockedBrowserLangs.mockReturnValue(['en-uk', 'ko-kr']);
    runFuncTest(DEFAULT_SLUG, DEFAULT_SLUG);
  });

  it('includes the query string and/or hash', () => {
    mockedBrowserLangs.mockReturnValue(['zh-cn', 'en']);
    runFuncTest('/docs/bar?a=b#c', '/zh-cn/docs/bar?a=b#c');
    runFuncTest('/docs/bar?a=b', '/zh-cn/docs/bar?a=b');
    runFuncTest('/docs/bar#c', '/zh-cn/docs/bar#c');
  });
});
