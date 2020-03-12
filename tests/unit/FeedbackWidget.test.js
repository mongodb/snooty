import React from 'react';
import { act } from 'react-dom/test-utils';
import { mount } from 'enzyme';
import {
  FeedbackProvider,
  FeedbackForm,
  FeedbackTab,
  FeedbackHeading,
  FeedbackFooter,
} from '../../src/components/FeedbackWidget';
import { withScreenSize } from './useScreenSize.test';
import * as stitch from '../../src/components/FeedbackWidget/stitch';
import { BSON } from 'mongodb-stitch-server-sdk';

import { FEEDBACK_QUALIFIERS_POSITIVE, FEEDBACK_QUALIFIERS_NEGATIVE } from './data/FeedbackWidget';

export async function tick() {
  const nextTick = new Promise(resolve => {
    setTimeout(resolve, 0);
  });
  jest.runAllTimers();
  return await nextTick;
}

export function mockMutationObserver() {
  global.MutationObserver = class {
    constructor(callback) {}
    disconnect() {}
    observe(element, initObject) {}
  };
}

export function mockSegmentAnalytics() {
  window.analytics = {
    user: jest.fn(() => ({
      id: jest.fn(() => 'test-id-please-ignore'),
    })),
  };
}

export const stitch_function_mocks = {};
export function mockStitchFunctions() {
  stitch_function_mocks['createNewFeedback'] = jest
    .spyOn(stitch, 'createNewFeedback')
    .mockImplementation(({ page, user, ...rest }) => {
      return {
        _id: new BSON.ObjectId(),
        page,
        user,
        ...rest,
      };
    });

  stitch_function_mocks['updateFeedback'] = jest
    .spyOn(stitch, 'updateFeedback')
    .mockImplementation(({ feedback_id, ...fields }) => {
      let qualifiers = fields.qualifiers || [];
      if (Object.keys(fields).includes('rating')) {
        qualifiers = fields.rating > 3 ? FEEDBACK_QUALIFIERS_POSITIVE : FEEDBACK_QUALIFIERS_NEGATIVE;
      }
      return { _id: feedback_id, qualifiers, ...fields };
    });

  stitch_function_mocks['submitFeedback'] = jest
    .spyOn(stitch, 'submitFeedback')
    .mockImplementation(({ feedback_id }) => {
      return { _id: feedback_id };
    });

  stitch_function_mocks['abandonFeedback'] = jest
    .spyOn(stitch, 'abandonFeedback')
    .mockImplementation(({ feedback_id }) => {
      return true;
    });

  stitch_function_mocks['addAttachment'] = jest
    .spyOn(stitch, 'addAttachment')
    .mockImplementation(({ feedback_id, attachment }) => {
      return {
        _id: feedback_id,
        attachments: [attachment],
      };
    });

  stitch_function_mocks['useStitchUser'] = jest.spyOn(stitch, 'useStitchUser').mockImplementation(() => {
    return {
      id: 'test-user-id',
    };
  });
}
export const clearMockStitchFunctions = () => {
  Object.keys(stitch_function_mocks).forEach(mockedFunctionName => {
    stitch_function_mocks[mockedFunctionName].mockClear();
  });
};

async function mountFormWithFeedbackState(feedbackState = {}, options = {}) {
  const { view, isSupportRequest, ...feedback } = feedbackState;
  const wrapper = mount(
    <FeedbackProvider
      test={{
        view,
        isSupportRequest,
        feedback: Object.keys(feedback).length ? feedback : null,
      }}
      page={{
        title: 'Test Page Please Ignore',
        slug: '/test',
        url: 'https://docs.mongodb.com/test',
        docs_property: 'test',
      }}
    >
      <FeedbackForm />
      <div>
        <FeedbackTab />
        <FeedbackHeading />
        <FeedbackFooter />
      </div>
    </FeedbackProvider>,
    options
  );
  // Need to wait for the next tick to let Loadable components load
  await act(async () => {
    await tick();
  });
  wrapper.update();
  return wrapper;
}

describe('FeedbackWidget', () => {
  jest.useFakeTimers();
  let wrapper;
  beforeAll(mockMutationObserver);
  beforeAll(mockSegmentAnalytics);
  beforeEach(mockStitchFunctions);
  afterEach(clearMockStitchFunctions);

  describe('FeedbackTab', () => {
    it('shows the rating view when clicked', async () => {
      wrapper = await mountFormWithFeedbackState({}, withScreenSize('desktop'));
      expect(wrapper.find('FeedbackTab').children()).toHaveLength(1);
      // Before the click, the form is hidden
      expect(wrapper.exists('FeedbackForm')).toEqual(true);
      expect(wrapper.find('FeedbackForm').children()).toHaveLength(0);
      // Click the tab
      await act(async () => {
        wrapper
          .find('FeedbackTab')
          .childAt(0)
          .simulate('click');
        await tick();
      });
      wrapper.update();
      // After the click new feedback is initialized
      expect(wrapper.find('FeedbackTab').children()).toHaveLength(0);
      expect(wrapper.exists('FeedbackForm')).toEqual(true);
      expect(wrapper.exists('RatingView')).toEqual(true);
    });

    it('is visible in the waiting view on large/desktop screens', async () => {
      wrapper = await mountFormWithFeedbackState({}, withScreenSize('desktop'));
      expect(wrapper.exists('FeedbackTab')).toBe(true);
      expect(wrapper.find('FeedbackTab').children()).toHaveLength(1);
    });

    it('is hidden outside of the waiting view on large/desktop screens', async () => {
      wrapper = await mountFormWithFeedbackState(
        {
          view: 'rating',
          comment: '',
          rating: null,
        },
        withScreenSize('desktop')
      );
      expect(wrapper.exists('RatingView')).toEqual(true);
      expect(wrapper.exists('FeedbackTab')).toBe(true);
      expect(wrapper.find('FeedbackTab')).toHaveLength(1);
      expect(wrapper.find('FeedbackTab').children()).toHaveLength(0);
    });

    it('is hidden on medium/tablet screens', async () => {
      wrapper = await mountFormWithFeedbackState({}, withScreenSize('ipad-pro'));
      expect(wrapper.exists('FeedbackTab')).toBe(true);
      expect(wrapper.find('FeedbackTab').children()).toHaveLength(0);
    });

    it('is hidden on small/mobile screens', async () => {
      wrapper = await mountFormWithFeedbackState({}, withScreenSize('iphone-x'));
      expect(wrapper.exists('FeedbackTab')).toBe(true);
      expect(wrapper.find('FeedbackTab').children()).toHaveLength(0);
    });
  });

  describe('FeedbackFooter', () => {
    it('is hidden on large/desktop screens', async () => {
      wrapper = await mountFormWithFeedbackState({}, withScreenSize('desktop'));
      expect(wrapper.exists('FeedbackFooter')).toBe(true);
      expect(wrapper.find('FeedbackFooter').children()).toHaveLength(0);
    });

    it('is visible on medium/tablet screens', async () => {
      wrapper = await mountFormWithFeedbackState({}, withScreenSize('ipad-pro'));
      expect(wrapper.exists('FeedbackFooter')).toBe(true);
      expect(wrapper.find('FeedbackFooter').children()).toHaveLength(1);
    });

    it('is visible on small/mobile screens', async () => {
      wrapper = await mountFormWithFeedbackState({}, withScreenSize('iphone-x'));
      expect(wrapper.exists('FeedbackFooter')).toBe(true);
      expect(wrapper.find('FeedbackFooter').children()).toHaveLength(1);
    });
  });

  describe('FeedbackForm', () => {
    it('renders as a floating card on large/desktop screens', async () => {
      wrapper = await mountFormWithFeedbackState(
        {
          view: 'rating',
          _id: new BSON.ObjectId(),
        },
        withScreenSize('desktop')
      );
      expect(wrapper.exists('FeedbackCard')).toBe(true);
    });

    it('renders as a modal window on medium/tablet screens', async () => {
      wrapper = await mountFormWithFeedbackState(
        {
          view: 'rating',
          _id: new BSON.ObjectId(),
        },
        withScreenSize('ipad-pro')
      );
      expect(wrapper.exists('FeedbackModal')).toBe(true);
    });

    it('renders as a full screen app on small/mobile screens', async () => {
      wrapper = await mountFormWithFeedbackState(
        {
          view: 'rating',
          _id: new BSON.ObjectId(),
        },
        withScreenSize('iphone-x')
      );
      expect(wrapper.exists('FeedbackFullScreen')).toBe(true);
    });

    it('abandons feedback when the form is closed', async () => {
      wrapper = await mountFormWithFeedbackState(
        {
          view: 'rating',
          _id: new BSON.ObjectId(),
        },
        withScreenSize('desktop')
      );
      // Click the close button
      await act(async () => {
        wrapper
          .find('FeedbackCard')
          .find('CloseButton')
          .simulate('click');
        await tick();
      });
      wrapper.update();
      expect(stitch_function_mocks['abandonFeedback']).toHaveBeenCalledTimes(1);
      expect(wrapper.exists('FeedbackCard')).toBe(false);
    });

    describe('RatingView', () => {
      it('shows a 5-star rating', async () => {
        wrapper = await mountFormWithFeedbackState(
          {
            view: 'rating',
            _id: new BSON.ObjectId(),
          },
          withScreenSize('desktop')
        );
        expect(wrapper.exists('RatingView')).toBe(true);
        expect(wrapper.exists('StarRating')).toBe(true);
        expect(wrapper.find('RatingView').find('Star')).toHaveLength(5);
      });

      it('transitions to the qualifiers view when a star is clicked', async () => {
        wrapper = await mountFormWithFeedbackState(
          {
            view: 'rating',
            _id: new BSON.ObjectId(),
          },
          withScreenSize('desktop')
        );

        // Simulate a 1-star rating
        await act(async () => {
          wrapper
            .find('RatingView')
            .find('Star')
            .first()
            .simulate('click');
          await tick();
        });
        wrapper.update();

        expect(wrapper.exists('RatingView')).toBe(false);
        expect(wrapper.exists('QualifiersView')).toBe(true);
      });
    });

    describe('QualifiersView', () => {
      it('shows positive qualifiers for a positive rating', async () => {
        wrapper = await mountFormWithFeedbackState(
          {
            view: 'qualifiers',
            rating: 4,
            qualifiers: FEEDBACK_QUALIFIERS_POSITIVE,
            comment: '',
          },
          withScreenSize('desktop')
        );
        expect(wrapper.exists('QualifiersView')).toBe(true);
        expect(wrapper.find('QualifiersView').text()).toContain("We're glad to hear that!");
        expect(wrapper.find('QualifiersView').text()).toContain('Tell us more.');
        expect(wrapper.find('Qualifier')).toHaveLength(4);
      });

      it('shows negative qualifiers for a negative rating', async () => {
        wrapper = await mountFormWithFeedbackState(
          {
            view: 'qualifiers',
            rating: 2,
            qualifiers: FEEDBACK_QUALIFIERS_NEGATIVE,
            comment: '',
          },
          withScreenSize('desktop')
        );
        expect(wrapper.exists('QualifiersView')).toBe(true);
        expect(wrapper.find('QualifiersView').text()).toContain("We're sorry to hear that.");
        expect(wrapper.find('QualifiersView').text()).toContain('What seems to be the issue?');
        expect(wrapper.find('Qualifier')).toHaveLength(4);
      });

      it('selects/unselects a qualifier when clicked', async () => {
        wrapper = await mountFormWithFeedbackState(
          {
            view: 'qualifiers',
            rating: 4,
            qualifiers: FEEDBACK_QUALIFIERS_POSITIVE,
            comment: '',
          },
          withScreenSize('desktop')
        );
        expect(wrapper.find('Qualifier')).toHaveLength(4);

        const isChecked = q => q.find('Checkbox').prop('checked');
        expect(isChecked(wrapper.find('Qualifier').at(0))).toBe(false);

        // Check the first qualifier
        await act(async () => {
          wrapper
            .find('Qualifier')
            .at(0)
            .simulate('click');
          await tick();
        });
        wrapper.update();
        expect(isChecked(wrapper.find('Qualifier').at(0))).toBe(true);
        expect(isChecked(wrapper.find('Qualifier').at(1))).toBe(false);
        expect(isChecked(wrapper.find('Qualifier').at(2))).toBe(false);
        expect(isChecked(wrapper.find('Qualifier').at(3))).toBe(false);
        expect(stitch_function_mocks['updateFeedback']).toHaveBeenCalledTimes(1);

        // Check the second qualifier
        await act(async () => {
          wrapper
            .find('Qualifier')
            .at(1)
            .simulate('click');
          await tick();
        });
        wrapper.update();
        expect(isChecked(wrapper.find('Qualifier').at(0))).toBe(true);
        expect(isChecked(wrapper.find('Qualifier').at(1))).toBe(true);
        expect(isChecked(wrapper.find('Qualifier').at(2))).toBe(false);
        expect(isChecked(wrapper.find('Qualifier').at(3))).toBe(false);
        expect(stitch_function_mocks['updateFeedback']).toHaveBeenCalledTimes(2);

        // Uncheck the first qualifier
        await act(async () => {
          wrapper
            .find('Qualifier')
            .at(0)
            .simulate('click');
          await tick();
        });
        wrapper.update();
        expect(isChecked(wrapper.find('Qualifier').at(0))).toBe(false);
        expect(isChecked(wrapper.find('Qualifier').at(1))).toBe(true);
        expect(isChecked(wrapper.find('Qualifier').at(2))).toBe(false);
        expect(isChecked(wrapper.find('Qualifier').at(3))).toBe(false);
        expect(stitch_function_mocks['updateFeedback']).toHaveBeenCalledTimes(3);
      });

      describe('when the Continue button is clicked', () => {
        it('transitions to the comment view', async () => {
          wrapper = await mountFormWithFeedbackState(
            {
              view: 'qualifiers',
              rating: 2,
              qualifiers: FEEDBACK_QUALIFIERS_NEGATIVE,
              comment: '',
            },
            withScreenSize('desktop')
          );

          await act(async () => {
            wrapper
              .find('QualifiersView')
              .find('Button')
              .simulate('click');
            await tick();
          });
          wrapper.update();

          expect(wrapper.exists('QualifiersView')).toBe(false);
          expect(wrapper.exists('CommentView')).toBe(true);
        });
      });
    });

    describe('CommentView', () => {
      it('shows a comment text input', async () => {
        wrapper = await mountFormWithFeedbackState(
          {
            view: 'comment',
            rating: 2,
            qualifiers: FEEDBACK_QUALIFIERS_NEGATIVE,
            comment: '',
          },
          withScreenSize('desktop')
        );
        // View
        expect(wrapper.exists('CommentView')).toBe(true);
        // Input
        const commentInput = wrapper.find('CommentTextArea');
        expect(commentInput.exists()).toBe(true);
        expect(commentInput.prop('placeholder')).toBe('Describe your experience.');
        // Input label
        const commentInputLabel = wrapper.find('InputLabel').filter({ htmlFor: commentInput.prop('id') });
        expect(commentInputLabel.exists()).toBe(true);
        expect(commentInputLabel.text()).toBe('Describe your experience.');
      });

      it('shows an email text input', async () => {
        wrapper = await mountFormWithFeedbackState(
          {
            view: 'comment',
            rating: 2,
            qualifiers: FEEDBACK_QUALIFIERS_NEGATIVE,
            comment: '',
          },
          withScreenSize('desktop')
        );
        // View
        expect(wrapper.exists('CommentView')).toBe(true);
        // Input
        const emailInput = wrapper.find('EmailInput');
        expect(emailInput.exists()).toBe(true);
        expect(emailInput.prop('placeholder')).toBe('someone@example.com');
        // Input label
        const emailInputLabel = wrapper.find('InputLabel').filter({ htmlFor: emailInput.prop('id') });
        expect(emailInputLabel.exists()).toBe(true);
        expect(emailInputLabel.text()).toBe('Email Address (optional)');
      });

      it('shows a Support button for feedback with a support request', async () => {
        wrapper = await mountFormWithFeedbackState(
          {
            view: 'comment',
            rating: 2,
            qualifiers: FEEDBACK_QUALIFIERS_NEGATIVE,
            comment: '',
            isSupportRequest: true,
          },
          withScreenSize('desktop')
        );

        const button = wrapper.find('CommentView').find('SubmitButton');
        expect(button.text()).toBe('Continue for Support');
      });

      it('shows a Submit button for feedback without a support request', async () => {
        wrapper = await mountFormWithFeedbackState(
          {
            view: 'comment',
            rating: 2,
            qualifiers: FEEDBACK_QUALIFIERS_NEGATIVE,
            comment: '',
            isSupportRequest: false,
          },
          withScreenSize('desktop')
        );

        const button = wrapper.find('CommentView').find('SubmitButton');
        expect(button.text()).toBe('Send');
      });

      describe('when the Support button is clicked', () => {
        it('submits the feedback and transitions to the support view', async () => {
          wrapper = await mountFormWithFeedbackState(
            {
              view: 'comment',
              rating: 2,
              qualifiers: FEEDBACK_QUALIFIERS_NEGATIVE,
              isSupportRequest: true,
            },
            withScreenSize('desktop')
          );

          await act(async () => {
            wrapper
              .find('CommentView')
              .find('SubmitButton')
              .simulate('click');
            await tick();
          });
          wrapper.update();
          expect(stitch_function_mocks['submitFeedback']).toHaveBeenCalledTimes(1);
          expect(wrapper.exists('CommentView')).toBe(false);
          expect(wrapper.exists('SubmittedView')).toBe(false);
          expect(wrapper.exists('SupportView')).toBe(true);
        });
      });
      describe('when the Submit button is clicked', () => {
        it('submits the feedback and transitions to the submitted view if the inputs are valid', async () => {
          wrapper = await mountFormWithFeedbackState(
            {
              view: 'comment',
              rating: 2,
              qualifiers: FEEDBACK_QUALIFIERS_NEGATIVE,
              comment: 'This is a test comment.',
              user: { email: 'test@example.com' },
            },
            withScreenSize('desktop')
          );

          await act(async () => {
            wrapper
              .find('CommentView')
              .find('SubmitButton')
              .simulate('click');
            await tick();
          });
          wrapper.update();

          expect(stitch_function_mocks['submitFeedback']).toHaveBeenCalledTimes(1);
          expect(wrapper.exists('CommentView')).toBe(false);
          expect(wrapper.exists('SubmittedView')).toBe(true);
        });
        it('raises an input error if an invalid email is specified', async () => {
          wrapper = await mountFormWithFeedbackState(
            {
              view: 'comment',
              rating: 2,
              qualifiers: FEEDBACK_QUALIFIERS_NEGATIVE,
              comment: '',
            },
            withScreenSize('desktop')
          );

          // Type in an invalid email address
          const emailInput = wrapper.find('EmailInput');
          await act(async () => {
            emailInput.simulate('change', { target: { value: 'not-a-valid-email-address' } });
            await tick();
          });
          wrapper.update();

          // Click the submit button
          const submitButton = wrapper.find('CommentView').find('SubmitButton');
          await act(async () => {
            submitButton.simulate('click');
            await tick();
          });
          wrapper.update();

          expect(wrapper.exists('CommentView')).toBe(true);
          expect(wrapper.exists('SubmittedView')).toBe(false);
          const emailInputErrorLabel = wrapper.find('InputErrorLabel').filter({ htmlFor: emailInput.prop('id') });
          expect(emailInputErrorLabel.exists()).toBe(true);
          expect(emailInputErrorLabel.text()).toBe('Please enter a valid email address.');
        });
      });
    });

    describe('SupportView', () => {
      it('shows self-serve support links', async () => {
        wrapper = await mountFormWithFeedbackState(
          {
            view: 'support',
            rating: 2,
            qualifiers: FEEDBACK_QUALIFIERS_NEGATIVE,
            isSupportRequest: true,
          },
          withScreenSize('desktop')
        );
        expect(wrapper.exists('SupportView')).toBe(true);
        const supportViewText = wrapper
          .find('SupportView')
          .children()
          .text();
        expect(supportViewText).toContain("We're sorry to hear that.");
        expect(supportViewText).toContain('Create a case on the Support Portal');
        expect(supportViewText).toContain('Visit MongoDB Community');
      });

      it('transitions to the submitted view when the Send button is clicked', async () => {
        wrapper = await mountFormWithFeedbackState(
          {
            view: 'support',
            rating: 2,
            qualifiers: FEEDBACK_QUALIFIERS_NEGATIVE,
            isSupportRequest: true,
          },
          withScreenSize('desktop')
        );
        expect(wrapper.exists('SupportView')).toBe(true);

        // Click the Done button
        await act(async () => {
          wrapper.find('Button').simulate('click');
          await tick();
        });
        wrapper.update();
      });
    });

    describe('SubmittedView', () => {
      it('shows summary information', async () => {
        wrapper = await mountFormWithFeedbackState(
          {
            view: 'submitted',
            feedback: {
              rating: 2,
              qualifiers: FEEDBACK_QUALIFIERS_NEGATIVE,
              isSubmitted: true,
            },
          },
          withScreenSize('desktop')
        );
        const view = wrapper.find('SubmittedView');
        expect(view.exists()).toBe(true);
        expect(view.find('Heading').text()).toBe('We appreciate your feedback.');
        expect(
          view
            .find('Subheading')
            .at(0)
            .text()
        ).toBe(`We're working hard to improve the MongoDB Documentation.`);
        expect(
          view
            .find('Subheading')
            .at(1)
            .text()
        ).toBe(`For additional support, explore the MongoDB discussion forum.`);
      });
    });
  });
});
