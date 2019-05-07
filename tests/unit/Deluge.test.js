import React from 'react';
import { shallow } from 'enzyme';
import Deluge from '../../src/components/Widgets/Deluge/Deluge';
jest.mock('mongodb-stitch-browser-sdk');

describe('Deluge', () => {
  let wrapper;
  const openDrawer = jest.fn();
  const invalidText = 'invalid';
  const setCustomValidityMock = jest.fn();
  const props = {
    canShowSuggestions: false,
    path: 'server/auth',
    project: 'guides',
    openDrawer,
  };

  beforeAll(() => {
    wrapper = shallow(<Deluge {...props} />);
  });

  it('renders a caption', () => {
    expect(wrapper.find('.caption')).toHaveLength(1);
  });

  describe('when a Yes votes is submitted', () => {
    it('updates the voteAcknowledgement state', () => {
      wrapper
        .find('MainWidget')
        .dive()
        .find('#rate-up')
        .simulate('click', { stopPropagation: jest.fn() });
      expect(wrapper.state().voteAcknowledgement).toBe('up');
    });
  });

  describe('when text is entered into the textarea', () => {
    const validResponse = 'this is valid response';

    it('has one FreeformQuestion child', () => {
      expect(wrapper.find('FreeformQuestion')).toHaveLength(1);
    });

    it('has formLengthError state set to false', () => {
      expect(wrapper.state().formLengthError).toBe(false);
    });

    it('sets the formLengthError state to true when invalid text is entered into the form', () => {
      wrapper
        .find('FreeformQuestion')
        .dive()
        .find('textarea')
        .simulate('change', {
          target: {
            value: invalidText,
            setCustomValidity: setCustomValidityMock,
          },
        });

      expect(wrapper.state().formLengthError).toBe(true);
    });

    it('sets the formLengthError state to false when valid text is entered into the form', () => {
      wrapper
        .find('FreeformQuestion')
        .dive()
        .find('textarea')
        .simulate('change', {
          target: {
            value: validResponse,
            setCustomValidity: setCustomValidityMock,
          },
        });

      expect(wrapper.state().formLengthError).toBe(false);
    });
  });

  describe('when text is entered into the email input', () => {
    const validEmail = 'test@mongodb.com';

    it('has one InputField child', () => {
      expect(wrapper.find('InputField')).toHaveLength(1);
    });

    it('has formLengthError state set to false', () => {
      expect(wrapper.state().emailError).toBe(false);
    });

    it('sets the emailError state to true when invalid text is entered into the form', () => {
      wrapper
        .find('InputField')
        .dive()
        .find('input')
        .simulate('change', {
          target: {
            value: invalidText,
            setCustomValidity: setCustomValidityMock,
          },
        });

      expect(wrapper.state().emailError).toBe(true);
    });

    it('sets the emailError state to false when a valid email is entered into the form', () => {
      wrapper
        .find('InputField')
        .dive()
        .find('input')
        .simulate('change', {
          target: {
            value: validEmail,
            setCustomValidity: setCustomValidityMock,
          },
        });

      expect(wrapper.state().emailError).toBe(false);
    });
  });
});
