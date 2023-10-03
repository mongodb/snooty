import { expect, jest, test } from '@jest/globals';
import { setLocalValue, getLocalValue } from '../../src/utils/browser-storage';

const errMsg = 'getItem error';
const mockLocalStorage = jest.spyOn(window, 'localStorage', 'get').mockImplementation(() => {
  return {
    getItem: (key) => {
      throw new Error(errMsg);
    },
  };
});

describe('when rendering in the browser', () => {
  test('setLocalValue does not break if no storage', () => {
    expect(window.localStorage.getItem).toThrowError(errMsg);
    expect(setLocalValue).not.toThrow();
  });

  test('getLocalValue does not break if no storage', () => {
    expect(window.localStorage.getItem).toThrowError(errMsg);
    expect(getLocalValue).not.toThrow();
  });
});

// // reset window.localStorage.getItem just so we don't mess up any global objects
afterAll(() => {
  mockLocalStorage.mockRestore();
});
