import React from 'react';
import { shallow } from 'enzyme';
import InputField from '../../src/components/Widgets/Deluge/InputField';

describe('InputField', () => {
  let wrapper;
  const testTextOne = 'error test';
  const testTextTwo = 'this is a valid submission message';
  const hasError = jest
    .fn()
    .mockReturnValue(false)
    .mockReturnValueOnce(true);
  const setCustomValidityMock = jest.fn();
  const mockStoreSet = jest.fn();
  const mockStoreGet = jest.fn();
  const props = {
    hasError,
    store: {
      get: mockStoreGet,
      set: mockStoreSet,
    },
  };

  beforeAll(() => {
    wrapper = shallow(<InputField {...props} />);
  });

  it('contains an input element', () => {
    expect(wrapper.find('input')).toHaveLength(1);
  });

  it('hides the error message', () => {
    expect(wrapper.find('.error').prop('style')).toHaveProperty('visibility', 'hidden');
  });

  describe('when an invalid submission is entered', () => {
    it('accepts text in the input element', () => {
      const input = wrapper.find('input');
      input.simulate('change', { target: { value: testTextOne, setCustomValidity: setCustomValidityMock } });
    });

    it('calls hasError() once', () => {
      expect(hasError).toHaveBeenCalledWith(testTextOne);
      expect(hasError).toHaveBeenCalledTimes(1);
      expect(hasError).toHaveReturnedWith(true);
    });

    it("calls the store's set function", () => {
      expect(mockStoreSet).toHaveBeenCalledTimes(1);
      expect(mockStoreSet).toHaveBeenCalledWith('');
    });

    it('calls setCustomValidity once', () => {
      expect(setCustomValidityMock).toHaveBeenCalledTimes(1);
      expect(setCustomValidityMock).toHaveBeenCalledWith(true);
    });

    it('shows the error message', () => {
      expect(wrapper.find('.error').prop('style')).toHaveProperty('visibility', 'visible');
    });

    it('displays the text in the input', () => {
      expect(wrapper.find('input').props().value).toBe(testTextOne);
    });
  });

  describe('when a valid submission is entered', () => {
    it('accepts more input in the input element', () => {
      const input = wrapper.find('input');
      input.simulate('change', { target: { value: testTextTwo, setCustomValidity: setCustomValidityMock } });
    });

    it('calls hasError() again', () => {
      expect(hasError).toHaveBeenCalledWith(testTextTwo);
      expect(hasError).toHaveBeenCalledTimes(2);
    });

    it("calls the store's set function again", () => {
      expect(mockStoreSet).toHaveBeenCalledTimes(2);
      expect(mockStoreSet).toHaveBeenCalledWith(testTextTwo);
    });

    it('hides the error message', () => {
      expect(wrapper.find('.error').prop('style')).toHaveProperty('visibility', 'hidden');
    });

    it('displays the text in the input', () => {
      expect(wrapper.find('input').props().value).toBe(testTextTwo);
    });
  });
});
