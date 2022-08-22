import React from 'react';
import { render, prettyDOM } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  FeedbackProvider,
  FeedbackForm,
  FeedbackTab,
  FeedbackFooter,
} from '../../src/components/Widgets/FeedbackWidget';
import { BSON } from 'mongodb-stitch-server-sdk';
import { matchers } from '@emotion/jest';

import { FEEDBACK_QUALIFIERS_POSITIVE, FEEDBACK_QUALIFIERS_NEGATIVE } from './data/FeedbackWidget';

import { tick, mockMutationObserver, mockSegmentAnalytics, setDesktop, setMobile, setTablet } from '../utils';
import {
  stitchFunctionMocks,
  mockStitchFunctions,
  clearMockStitchFunctions,
} from '../utils/feedbackWidgetStitchFunctions';
import Heading from '../../src/components/Heading';
import headingData from './data/Heading.test.json';
import { theme } from '../../src/theme/docsTheme';
import { fwFunctionMocks, mockFWFunctions, clearMockFWFunctions } from '../utils/data/feedbackWidgetFunctions';

// import useScreenshot from '../../src/components/Widgets/FeedbackWidget/hooks/useScreenshot';

async function mountFormWithFeedbackState(feedbackState = {}, options = {}) {
  const { view, isSupportRequest, hideHeader, screenshotTaken, ...feedback } = feedbackState;
  const wrapper = render(
    <>
      <p>Sample paragraph</p>
      <FeedbackProvider
        test={{
          view,
          isSupportRequest,
          feedback: Object.keys(feedback).length ? feedback : null,
          screenshotTaken,
        }}
        page={{
          title: 'Test Page Please Ignore',
          slug: '/test',
          url: 'https://docs.mongodb.com/test',
          docs_property: 'test',
        }}
        hideHeader={hideHeader}
      >
        <FeedbackForm />
        <div>
          <FeedbackTab />
          <Heading nodeData={headingData} sectionDepth={1} />
          <FeedbackFooter />
        </div>
      </FeedbackProvider>
    </>
  );
  // Need to wait for the next tick to let Loadable components load
  await tick();
  return wrapper;
}

expect.extend(matchers);

describe('FeedbackWidget', () => {
  jest.useFakeTimers();
  let wrapper;
  beforeAll(mockMutationObserver);
  beforeAll(mockSegmentAnalytics);
  beforeEach(setDesktop);
  beforeEach(mockStitchFunctions);
  afterEach(clearMockStitchFunctions);

  beforeEach(mockFWFunctions);
  afterEach(clearMockFWFunctions);

  describe('FeedbackTab (Desktop Viewport)', () => {
    it('shows the rating view when clicked', async () => {
      wrapper = await mountFormWithFeedbackState({});
      // Before the click, the form is hidden
      expect(wrapper.queryAllByText('How helpful was this page?')).toHaveLength(0);
      // Click the tab
      userEvent.click(wrapper.getByText('Give Feedback'));

      await tick();
      // After the click new feedback is initialized
      expect(wrapper.queryAllByText('How helpful was this page?')).toHaveLength(1);
    });

    it('is visible in the waiting view on large/desktop screens', async () => {
      wrapper = await mountFormWithFeedbackState({});
      expect(wrapper.queryAllByText('Give Feedback')).toHaveLength(1);
    });

    it('is hidden outside of the waiting view on large/desktop screens', async () => {
      wrapper = await mountFormWithFeedbackState({
        view: 'rating',
        comment: '',
        rating: null,
      });
      expect(wrapper.queryAllByText('How helpful was this page?')).toHaveLength(1);
    });

    it('is hidden on small/mobile and medium/tablet screens', async () => {
      wrapper = await mountFormWithFeedbackState({});
      expect(wrapper.queryAllByText('Give Feedback')).toHaveLength(1);
      expect(wrapper.queryAllByText('Give Feedback')[0]).toHaveStyleRule('display', 'none', {
        media: `${theme.screenSize.upToLarge}`,
      });
    });
  });

  describe('FeedbackHeading (Mobile Viewport)', () => {
    it('is hidden on large/desktop screens', async () => {
      wrapper = await mountFormWithFeedbackState({});
      expect(wrapper.queryAllByText('Give Feedback')).toHaveLength(1);
      expect(wrapper.queryAllByText('Give Feedback')[0]).toHaveStyleRule('display', 'none', {
        media: `${theme.screenSize.upToLarge}`,
      });
    });

    it('is visible on medium/tablet screens', async () => {
      setTablet();
      wrapper = await mountFormWithFeedbackState({});
      expect(wrapper.queryAllByText('Give Feedback')).toHaveLength(2);
      expect(wrapper.queryAllByText('Give Feedback')[0]).toHaveStyleRule('display', 'none', {
        media: `${theme.screenSize.upToLarge}`,
      });
    });

    it('is visible on small/mobile screens', async () => {
      setMobile();
      wrapper = await mountFormWithFeedbackState({});
      expect(wrapper.queryAllByText('Give Feedback')).toHaveLength(2);
    });

    it('is hidden on small/mobile screens when configured with page option', async () => {
      setMobile();
      wrapper = await mountFormWithFeedbackState({ hideHeader: true });
      expect(wrapper.queryAllByText('Give Feedback')).toHaveLength(1);
    });
  });

  describe('FeedbackFooter', () => {
    it('is hidden on large/desktop screens', async () => {
      wrapper = await mountFormWithFeedbackState({});
      expect(wrapper.queryAllByText('How helpful was this page?')).toHaveLength(0);
    });

    it('is visible on medium/tablet screens', async () => {
      setTablet();
      wrapper = await mountFormWithFeedbackState({});
      expect(wrapper.queryAllByText('How helpful was this page?')).toHaveLength(1);
    });

    it('is visible on small/mobile screens', async () => {
      setMobile();
      wrapper = await mountFormWithFeedbackState({});
      expect(wrapper.queryAllByText('How helpful was this page?')).toHaveLength(1);
    });
  });

  describe('FeedbackForm', () => {
    it('abandons feedback when the form is closed', async () => {
      wrapper = await mountFormWithFeedbackState({
        view: 'rating',
        _id: new BSON.ObjectId(),
      });
      // Click the close button
      userEvent.click(wrapper.getByLabelText('Close Feedback Form'));
      await tick();
      expect(stitchFunctionMocks['abandonFeedback']).toHaveBeenCalledTimes(1);
      expect(wrapper.queryAllByText('How helpful was this page?')).toHaveLength(0);
    });

    describe('RatingView', () => {
      it('shows a 5-star rating', async () => {
        wrapper = await mountFormWithFeedbackState({
          view: 'rating',
          _id: new BSON.ObjectId(),
        });
        expect(wrapper.container.getElementsByClassName('fa-star').length).toBe(5);
      });

      it('transitions to the qualifiers view when a star is clicked', async () => {
        wrapper = await mountFormWithFeedbackState({
          view: 'rating',
          _id: new BSON.ObjectId(),
        });

        // Simulate a 1-star rating
        userEvent.click(wrapper.container.getElementsByClassName('fa-star')[0]);
        await tick();
        expect(wrapper.getByText('What seems to be the issue?')).toBeTruthy();
      });
    });

    describe('QualifiersView', () => {
      it('shows positive qualifiers for a positive rating', async () => {
        wrapper = await mountFormWithFeedbackState({
          view: 'qualifiers',
          rating: 4,
          qualifiers: FEEDBACK_QUALIFIERS_POSITIVE,
          comment: '',
        });
        expect(wrapper.queryByText("We're glad to hear that!")).toBeTruthy();
        expect(wrapper.queryByText('Tell us more.')).toBeTruthy();
      });

      it('shows negative qualifiers for a negative rating', async () => {
        wrapper = await mountFormWithFeedbackState({
          view: 'qualifiers',
          rating: 2,
          qualifiers: FEEDBACK_QUALIFIERS_NEGATIVE,
          comment: '',
        });
        expect(wrapper.queryByText("We're sorry to hear that.")).toBeTruthy();
        expect(wrapper.queryByText('What seems to be the issue?')).toBeTruthy();
      });

      it('calls updateFeedback in stitch when qualifier clicked', async () => {
        wrapper = await mountFormWithFeedbackState({
          view: 'qualifiers',
          rating: 4,
          qualifiers: FEEDBACK_QUALIFIERS_POSITIVE,
          comment: '',
        });
        expect(wrapper.queryAllByRole('checkbox').length).toBe(4);
        expect(wrapper.queryAllByRole('checkbox', { checked: true }).length).toBe(0);

        // Check the first qualifier
        userEvent.click(wrapper.queryAllByRole('checkbox')[0].closest('div'));
        await tick();
        expect(stitchFunctionMocks['updateFeedback']).toHaveBeenCalledTimes(1);

        // Check the second qualifier
        userEvent.click(wrapper.queryAllByRole('checkbox')[1].closest('div'));
        expect(stitchFunctionMocks['updateFeedback']).toHaveBeenCalledTimes(2);

        // Uncheck the first qualifier
        userEvent.click(wrapper.queryAllByRole('checkbox')[0].closest('div'));
        await tick();
        expect(stitchFunctionMocks['updateFeedback']).toHaveBeenCalledTimes(3);
      });

      describe('when the Continue button is clicked', () => {
        it('transitions to the comment view', async () => {
          wrapper = await mountFormWithFeedbackState({
            view: 'qualifiers',
            rating: 2,
            qualifiers: FEEDBACK_QUALIFIERS_NEGATIVE,
            comment: '',
          });

          userEvent.click(wrapper.getByText('Continue').closest('button'));

          await tick();
          expect(wrapper.getByText('What seems to be the issue?')).toBeTruthy();
        });
      });
    });

    describe('CommentView', () => {
      it('shows a comment text input', async () => {
        wrapper = await mountFormWithFeedbackState({
          view: 'comment',
          rating: 2,
          qualifiers: FEEDBACK_QUALIFIERS_NEGATIVE,
          comment: '',
        });
        expect(wrapper.getByLabelText('Comment')).toBeTruthy();
      });

      it('shows an email text input', async () => {
        wrapper = await mountFormWithFeedbackState({
          view: 'comment',
          rating: 2,
          qualifiers: FEEDBACK_QUALIFIERS_NEGATIVE,
          comment: '',
        });
        expect(wrapper.getByLabelText('Email Address')).toBeTruthy();
      });

      it('shows a Support button for feedback with a support request', async () => {
        wrapper = await mountFormWithFeedbackState({
          view: 'comment',
          rating: 2,
          qualifiers: FEEDBACK_QUALIFIERS_NEGATIVE,
          comment: '',
          isSupportRequest: true,
        });
        expect(wrapper.getByText('Continue for Support')).toBeTruthy();
      });

      it('shows a Submit button for feedback without a support request', async () => {
        wrapper = await mountFormWithFeedbackState({
          view: 'comment',
          rating: 2,
          qualifiers: FEEDBACK_QUALIFIERS_NEGATIVE,
          comment: '',
          isSupportRequest: false,
        });

        expect(wrapper.getByText('Send')).toBeTruthy();
      });

      describe('when the Screenshot button is clicked', () => {
        it('shows the overlays', async () => {
          wrapper = await mountFormWithFeedbackState({
            view: 'comment',
            rating: 2,
            qualifiers: FEEDBACK_QUALIFIERS_NEGATIVE,
            comment: 'This is a test comment.',
            user: { email: 'test@example.com' },
            screenshotTaken: true,
          });

          // click on screenshot button
          userEvent.click(wrapper.getAllByRole('button')[2]);
          await tick();

          // shows overlays
          expect(fwFunctionMocks['addEventListener']).toHaveBeenCalled();
          expect(wrapper.getByRole('img')).toHaveClass('overlayInstructions');
          console.log(prettyDOM(wrapper.container));
          // user select element on the page
          // ?? - this doesn't update the selected element
          userEvent.click(wrapper.container.getElementsByTagName('p')[0]);
          await tick();

          console.log(prettyDOM(wrapper.container));

          // click on Send button, should trigger useScreenshot hook
          userEvent.click(wrapper.getByText('Send').closest('button'));
          await tick();

          // expect(fwFunctionMocks['useScreenshot']).toHaveBeenCalled();
          // expect(stitchFunctionMocks 'submitFeedback']).toHaveBeenCalledTimes(1);
          // expect(stitchFunctionMocks['addAttachment']).toHaveBeenCalled();
        });
      });

      describe('when the Submit button is clicked', () => {
        it('submits the feedback and transitions to the submitted view if the inputs are valid', async () => {
          wrapper = await mountFormWithFeedbackState({
            view: 'comment',
            rating: 2,
            qualifiers: FEEDBACK_QUALIFIERS_NEGATIVE,
            comment: 'This is a test comment.',
            user: { email: 'test@example.com' },
          });

          // Click the submit button
          userEvent.click(wrapper.getByText('Send').closest('button'));
          await tick();

          expect(stitchFunctionMocks['submitFeedback']).toHaveBeenCalledTimes(1);
        });
        it('raises an input error if an invalid email is specified', async () => {
          wrapper = await mountFormWithFeedbackState({
            view: 'comment',
            rating: 2,
            qualifiers: FEEDBACK_QUALIFIERS_NEGATIVE,
            comment: '',
          });

          // Type in an invalid email address
          const emailInput = wrapper.getByLabelText('Email Address');
          userEvent.paste(emailInput, 'not-a-valid-email-address');

          // Click the submit button
          userEvent.click(wrapper.getByText('Send').closest('button'));
          await tick();
          expect(wrapper.getByLabelText('Please enter a valid email address.')).toBeTruthy();
        });
      });
    });

    describe('SupportView', () => {
      it('shows self-serve support links', async () => {
        wrapper = await mountFormWithFeedbackState({
          view: 'support',
          rating: 2,
          qualifiers: FEEDBACK_QUALIFIERS_NEGATIVE,
          isSupportRequest: true,
        });
        expect(wrapper.getByText("We're sorry to hear that.")).toBeTruthy();
        expect(wrapper.getByText('Create a case on the Support Portal')).toBeTruthy();
        expect(wrapper.getByText('Visit MongoDB Community')).toBeTruthy();
      });
    });

    describe('SubmittedView', () => {
      it('shows summary information', async () => {
        wrapper = await mountFormWithFeedbackState({
          view: 'submitted',
          feedback: {
            rating: 2,
            qualifiers: FEEDBACK_QUALIFIERS_NEGATIVE,
            isSubmitted: true,
          },
        });
        expect(wrapper.getByText('We appreciate your feedback.')).toBeTruthy();
        expect(wrapper.getByText(`We're working hard to improve the MongoDB Documentation.`)).toBeTruthy();
      });
    });
  });
});
