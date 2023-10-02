import { expect, jest, test } from '@jest/globals';
import { setLocalValue } from '../../src/utils/browser-storage';

jest.spyOn(window, 'localStorage', 'get').mockImplementation(() => {
  return {
    getItem: (key) => {
      throw new Error('Test');
    },
  };
});

test('browser loads if setLocalValue breaks', () => {
  expect(window.localStorage.getItem).toThrow();
  expect(setLocalValue).not.toThrow();
});
