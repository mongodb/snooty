import React from 'react';
import { shallow } from 'enzyme';
import BinaryQuestion from '../../src/components/Widgets/Deluge/BinaryQuestion';

describe('BinaryQuestion', () => {
  let wrapper;
  const mockStoreSet = jest.fn();
  const mockStoreGet = jest.fn();
  const caption = 'Test caption';
  const props = {
    children: [caption],
    store: {
      get: mockStoreGet,
      set: mockStoreSet,
    },
  };

  beforeAll(() => {
    wrapper = shallow(<BinaryQuestion {...props} />);
  });

  it('displays two vote buttons', () => {
    expect(wrapper.find('.switch')).toHaveLength(2);
    expect(wrapper.find('.good')).toHaveLength(1);
    expect(wrapper.find('.bad')).toHaveLength(1);
  });

  it("calls the store's get method", () => {
    expect(mockStoreGet).toHaveBeenCalledTimes(1);
  });

  it('allows a user to submit a positive vote', () => {
    wrapper.find('.good').simulate('click');
    expect(mockStoreSet).toHaveBeenCalledTimes(1);
    expect(mockStoreSet).toHaveBeenCalledWith(true);
  });

  it('allows a user to submit a negative vote', () => {
    wrapper.find('.bad').simulate('click');
    expect(mockStoreSet).toHaveBeenCalledTimes(2);
    expect(mockStoreSet).toHaveBeenCalledWith(false);
  });

  it('displays a caption', () => {
    expect(wrapper.find('div').at(1).text()).toEqual(caption);
  });
});
