import { renderHook } from '@testing-library/react';
import { useLocaleRedirect } from '../../src/hooks/use-locale-redirect';
import * as browserStorage from '../../src/utils/browser-storage';
import mockStaticQuery from '../utils/mockStaticQuery';

const DEFAULT_SLUG = '/foo';

const defineWindowLocation = (value = {}) => {
  global.window = Object.create(window);
  Object.defineProperty(window, 'location', {
    value,
    // Allows tests to rewrite this object
    writable: true,
  });
};

const runHookTest = (originalPathname, expectedPathname) => {
  defineWindowLocation({
    pathname: originalPathname,
    // Implementation detail: window.location.href should be defined since it won't be set if no redirect occurs
    href: originalPathname,
  });

  renderHook(() => useLocaleRedirect(originalPathname));
  expect(window.location.href).toBe(expectedPathname);
};

describe('useLocaleRedirect', () => {
  let mockedGetLocalValue;
  let mockedBrowserLangs;

  beforeAll(() => {
    mockStaticQuery();
    mockedGetLocalValue = jest.spyOn(browserStorage, 'getLocalValue');
    mockedBrowserLangs = jest.spyOn(window.navigator, 'languages', 'get');
  });

  afterAll(() => {
    mockedGetLocalValue.mockClear();
    mockedBrowserLangs.mockClear();
  });

  it('redirects to first eligible browser language', () => {
    mockedBrowserLangs.mockReturnValue(['aa-aa', 'bb-bb', 'ko-kr', 'en-us']);
    runHookTest(DEFAULT_SLUG, '/ko-kr' + DEFAULT_SLUG);
  });

  it('does not redirect when not on an English URL', () => {
    mockedBrowserLangs.mockReturnValue(['aa-aa', 'bb-bb', 'ko-kr', 'en-us']);
    const pathname = '/pt-br' + DEFAULT_SLUG;
    runHookTest(pathname, pathname);
  });

  it('does not redirect when primary browser language is English', () => {
    mockedBrowserLangs.mockReturnValue(['en-us', 'ko-kr']);
    runHookTest(DEFAULT_SLUG, DEFAULT_SLUG);
  });

  it('does not redirect when preferred locale is en-us', () => {
    mockedBrowserLangs.mockReturnValue(['aa-aa', 'bb-bb', 'ko-kr']);
    mockedGetLocalValue.mockReturnValueOnce('en-us');
    runHookTest(DEFAULT_SLUG, DEFAULT_SLUG);
  });

  it('does not redirect when no language matches', () => {
    mockedBrowserLangs.mockReturnValue(['aa-aa', 'bb-bb']);
    runHookTest(DEFAULT_SLUG, DEFAULT_SLUG);
  });

  it('ignores region', () => {
    // "en" should take precedence over "ko" here
    mockedBrowserLangs.mockReturnValue(['en-uk', 'ko-kr']);
    runHookTest(DEFAULT_SLUG, DEFAULT_SLUG);
  });
});
