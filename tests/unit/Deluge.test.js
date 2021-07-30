import React from 'react';
import { shallow } from 'enzyme';
import Deluge from '../../src/components/Widgets/Deluge/Deluge';

describe('Deluge', () => {
  let wrapper;
  const openDrawer = jest.fn();
  const invalidText = 'invalid';
  const setCustomValidityMock = jest.fn();
  const props = {
    canShowSuggestions: false,
    path: 'server/auth',
    project: 'datalake',
    openDrawer,
  };

  beforeAll(() => {
    wrapper = shallow(<Deluge {...props} />);
    wrapper.instance().setupStitch = jest.fn();
    wrapper.instance().sendVote = jest.fn().mockResolvedValue(true);
  });

  it('renders a caption', () => {
    expect(wrapper.find('.caption')).toHaveLength(1);
  });

  it('has one FreeformQuestion child', () => {
    expect(wrapper.find('FreeformQuestion')).toHaveLength(1);
  });

  describe('when a Yes votes is submitted', () => {
    it('updates the voteAcknowledgement state', () => {
      wrapper.find('MainWidget').dive().find('#rate-up').simulate('click', { stopPropagation: jest.fn() });
      setTimeout(() => {
        expect(wrapper.state().voteAcknowledgement).toBe('up');
      }, 500);
    });
  });

  describe('when text is entered into the email input', () => {
    const validEmail = 'test@mongodb.com';

    it('has one InputField child', () => {
      expect(wrapper.find('InputField')).toHaveLength(1);
    });

    it('has emailError state set to false', () => {
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
