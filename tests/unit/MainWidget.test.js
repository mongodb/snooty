import React from 'react';
import { shallow } from 'enzyme';
import MainWidget from '../../src/components/Widgets/Deluge/MainWidget';

describe('MainWidget', () => {
  let wrapper;
  const error = false;
  const onSubmitVote = jest.fn();
  const onSubmitFeedback = jest.fn();
  const onClear = jest.fn();
  const handleOpenDrawer = jest.fn();
  const canShowSuggestions = false;
  const children = [];
  const props = {
    error,
    onSubmitVote,
    onSubmitFeedback,
    onClear,
    handleOpenDrawer,
    canShowSuggestions,
    children,
  };

  beforeAll(() => {
    wrapper = shallow(<MainWidget {...props} />);
  });

  describe('when feedback widget is first rendered', () => {
    it('shows yes/no buttons', () => {
      expect(wrapper.find('.deluge-vote')).toHaveLength(1);
      expect(wrapper.find('#rate-up')).toHaveLength(1);
      expect(wrapper.find('#rate-down')).toHaveLength(1);
    });

    it('shows the header', () => {
      expect(wrapper.find('.deluge-header')).toHaveLength(1);
    });

    it('does not show any body elements', () => {
      expect(wrapper.find('.deluge-body').children()).toHaveLength(0);
    });
  });

  describe("when a 'Yes' vote is cast", () => {
    it('clicks the yes button', () => {
      const yesButton = wrapper.find('#rate-up');
      yesButton.simulate('click', { stopPropagation: jest.fn() });
    });

    it('updates the state', () => {
      expect(wrapper.state().state).toBe(true);
    });

    it('calls onSubmitVote', () => {
      expect(onSubmitVote).toHaveBeenCalledTimes(1);
      expect(onSubmitVote).toHaveBeenCalledWith(true);
    });

    it('does not call handleOpenDrawer', () => {
      expect(handleOpenDrawer).toHaveBeenCalledTimes(0);
    });
  });

  describe('then the next screen is displayed', () => {
    it('shows the widget body', () => {
      expect(wrapper.find('.deluge-body').children()).not.toHaveLength(0);
      expect(wrapper.find('.deluge-questions')).toHaveLength(1);
    });

    it('does not show a Sorry message', () => {
      expect(wrapper.find('ul').children()).toHaveLength(0);
    });

    it('shows a Submit button', () => {
      expect(wrapper.find('button[type="submit"]')).toHaveLength(1);
    });

    it('shows a Cancel button', () => {
      expect(wrapper.find('button[type="button"]')).toHaveLength(1);
      expect(wrapper.find('button')).toHaveLength(2);
    });
  });

  describe('when the cancel button is clicked', () => {
    it('clicks cancel', () => {
      const cancelButton = wrapper.find('button[type="button"]');
      cancelButton.simulate('click', { stopPropagation: jest.fn() });
    });

    it('updates the state', () => {
      expect(wrapper.state().state).toBe('Initial');
    });

    it('shows the minimized feedback widget', () => {
      expect(wrapper.find('.deluge-header-minimized')).toHaveLength(1);
    });

    it('shows the reopen button', () => {
      expect(wrapper.find('.deluge-open-icon')).toHaveLength(1);
    });

    it('does not show any body elements', () => {
      expect(wrapper.find('.deluge-body').children()).toHaveLength(0);
    });
  });

  describe('when the reopen button is clicked', () => {
    it('clicks the reopen button', () => {
      const openButton = wrapper.find('.deluge-header-minimized');
      openButton.simulate('click', { stopPropagation: jest.fn() });
    });

    it('shows yes/no buttons', () => {
      expect(wrapper.find('.deluge-vote')).toHaveLength(1);
      expect(wrapper.find('#rate-up')).toHaveLength(1);
      expect(wrapper.find('#rate-down')).toHaveLength(1);
    });

    it('shows the header', () => {
      expect(wrapper.find('.deluge-header')).toHaveLength(1);
    });

    it('does not show any body elements', () => {
      expect(wrapper.find('.deluge-body').children()).toHaveLength(0);
    });
  });

  describe("when a 'No' vote is cast", () => {
    it('clicks the no button', () => {
      const noButton = wrapper.find('#rate-down');
      noButton.simulate('click', { stopPropagation: jest.fn() });
    });

    it('updates the state', () => {
      expect(wrapper.state().state).toBe(false);
    });

    it('calls onSubmitVote', () => {
      expect(onSubmitVote).toHaveBeenCalledTimes(2);
      expect(onSubmitVote).toHaveBeenCalledWith(false);
    });

    it('calls handleOpenDrawer', () => {
      expect(handleOpenDrawer).toHaveBeenCalledTimes(1);
    });

    it('shows a Sorry message', () => {
      expect(wrapper.find('ul').children()).toHaveLength(1);
    });
  });

  describe('when the Submit button is clicked', () => {
    it('clicks Submit', () => {
      const submitButton = wrapper.find('button[type="submit"]');
      submitButton.simulate('click');
    });

    it('calls onSubmitFeedback', () => {
      expect(onSubmitFeedback).toHaveBeenCalledTimes(1);
    });

    it('updates the state', () => {
      expect(wrapper.state().state).toBe('Voted');
    });

    it('shows a link to JIRA', () => {
      // wait for setState to finish
      setTimeout(() => {
        expect(wrapper.find('.deluge-fix-button')).toHaveLength(2);
      }, 500);
    });

    it('shows a close button', () => {
      expect(wrapper.find('.deluge-close-link')).toHaveLength(1);
    });
  });

  describe('clicking the close button', () => {
    it('clicks Close', () => {
      const closeButton = wrapper.find('.deluge-close-link').childAt(0).childAt(0);
      closeButton.simulate('click', { stopPropagation: jest.fn() });
    });

    it('shows the minimized feedback widget', () => {
      expect(wrapper.find('.deluge-header-minimized')).toHaveLength(1);
    });
  });
});
