import { expect, jest, test } from '@jest/globals';
import { setLocalValue } from '../../src/utils/browser-storage';

jest.spyOn(window, 'localStorage', 'get').mockImplementation(() => {
  return {
    getItem: (key) => {
      throw new Error('Testing error in browser-storage.test.js');
    },
  };
});

test('browser loads if setLocalValue breaks', () => {
  expect(window.localStorage.getItem).toThrow();
  expect(setLocalValue).not.toThrow();
});
