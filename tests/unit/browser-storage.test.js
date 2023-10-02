import React from 'react';
import { render } from '@testing-library/react';
import { setLocalValue, getLocalValue } from '../../src/utils/browser-storage';
import { expect, jest, test } from '@jest/globals';

const mockGetItem = jest.spyOn(window.localStorage.getItem('mongodb-docs'), 'getItem');

// mock window.localStorage.getItem so it always throws an error
mockGetItem.mockImplementation(() => {
  throw new Error('Error in test');
});

test('browser loads if setLocalValue breaks', () => {
  expect(mockGetItem.toThrow());
  expect(setLocalValue.not.toThrow());
});
