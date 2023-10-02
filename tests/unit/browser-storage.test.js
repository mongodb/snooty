import { setLocalValue } from '../../src/utils/browser-storage';
import { expect, jest, test } from '@jest/globals';

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
