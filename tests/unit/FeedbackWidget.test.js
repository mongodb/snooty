import React from 'react';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { matchers } from '@emotion/jest';
import {
  FeedbackProvider,
  FeedbackForm,
  FeedbackButton,
  FeedbackFooter,
} from '../../src/components/Widgets/FeedbackWidget';

import { tick, mockMutationObserver, mockSegmentAnalytics, setDesktop, setMobile, setTablet } from '../utils';
import {
  stitchFunctionMocks,
  mockStitchFunctions,
  clearMockStitchFunctions,
} from '../utils/feedbackWidgetStitchFunctions';
import Heading from '../../src/components/Heading';
import {
  screenshotFunctionMocks,
  mockScreenshotFunctions,
  clearMockScreenshotFunctions,
} from '../utils/data/feedbackWidgetScreenshotFunctions';
import {
  CLOSE_BUTTON_ALT_TEXT,
  COMMENT_PLACEHOLDER_TEXT,
  EMAIL_ERROR_TEXT,
  EMAIL_PLACEHOLDER_TEXT,
  FEEDBACK_BUTTON_TEXT,
  FEEDBACK_SUBMIT_BUTTON_TEXT,
  RATING_QUESTION_TEXT,
  SCREENSHOT_BUTTON_TEXT,
  SCREENSHOT_OVERLAY_ALT_TEXT,
  SUBMITTED_VIEW_RESOURCE_LINKS,
  SUBMITTED_VIEW_SUPPORT_LINK,
  SUBMITTED_VIEW_TEXT,
} from '../../src/components/Widgets/FeedbackWidget/constants';
import headingData from './data/Heading.test.json';

async function mountFormWithFeedbackState(feedbackState = {}) {
  const { view, isSupportRequest, hideHeader, screenshotTaken, ...feedback } = feedbackState;
  const wrapper = render(
    <>
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
          <FeedbackButton />
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
const snootyEnv = 'development';
jest.mock('../../src/hooks/use-site-metadata', () => ({
  useSiteMetadata: () => ({ snootyEnv }),
}));

expect.extend(matchers);

describe('FeedbackWidget', () => {
  jest.useFakeTimers();
  let wrapper;
  beforeAll(mockMutationObserver);
  beforeAll(mockSegmentAnalytics);
  beforeEach(setDesktop);
  beforeEach(mockStitchFunctions);
  afterEach(clearMockStitchFunctions);
  beforeEach(mockScreenshotFunctions);
  afterEach(clearMockScreenshotFunctions);

  describe('FeedbackButton (Desktop Viewport)', () => {
    it('shows the rating view when clicked', async () => {
      wrapper = await mountFormWithFeedbackState({});
      // Before the click, the form is hidden
      expect(wrapper.queryAllByText(RATING_QUESTION_TEXT)).toHaveLength(0);
      // Click the tab
      userEvent.click(wrapper.getByText(FEEDBACK_BUTTON_TEXT));

      await tick();
      // After the click new feedback is initialized
      expect(wrapper.queryAllByText(RATING_QUESTION_TEXT)).toHaveLength(1);
    });

    it('is visible in the waiting view on large/desktop screens', async () => {
      wrapper = await mountFormWithFeedbackState({});
      expect(wrapper.queryAllByText(FEEDBACK_BUTTON_TEXT)).toHaveLength(1);
    });

    it('is hidden outside of the waiting view on large/desktop screens', async () => {
      wrapper = await mountFormWithFeedbackState({
        view: 'rating',
        comment: '',
      });
      expect(wrapper.queryAllByText(RATING_QUESTION_TEXT)).toHaveLength(1);
    });
  });

  describe('FeedbackFooter', () => {
    it('is hidden on large/desktop screens', async () => {
      wrapper = await mountFormWithFeedbackState({});
      expect(wrapper.queryAllByText('Did this page help?')).toHaveLength(0);
    });

    it('is visible on medium/tablet screens', async () => {
      setTablet();
      wrapper = await mountFormWithFeedbackState({});
      expect(wrapper.queryAllByText('Did this page help?')).toHaveLength(1);
    });

    it('is visible on small/mobile screens', async () => {
      setMobile();
      wrapper = await mountFormWithFeedbackState({});
      expect(wrapper.queryAllByText('Did this page help?')).toHaveLength(1);
    });
  });

  describe('FeedbackForm', () => {
    it('waiting state when the form is closed', async () => {
      wrapper = await mountFormWithFeedbackState({
        view: 'rating',
      });
      // Click the close button
      userEvent.click(wrapper.getByLabelText(CLOSE_BUTTON_ALT_TEXT));
      await tick();
      expect(wrapper.queryAllByText(RATING_QUESTION_TEXT)).toHaveLength(0);
    });

    describe('SentimentView', () => {
      it('Shows 5 stars for rating', async () => {
        wrapper = await mountFormWithFeedbackState({
          view: 'rating',
        });
        expect(wrapper.getAllByTestId('rating-star')).toHaveLength(5);
      });

      it('transitions to the comment view when a rating is clicked', async () => {
        wrapper = await mountFormWithFeedbackState({
          view: 'rating',
        });
        const stars = wrapper.getAllByTestId('rating-star');
        const selectedRating = 5;
        const selectedStar = stars[selectedRating - 1];
        userEvent.click(selectedStar);
        await tick();
        expect(wrapper.getByPlaceholderText(COMMENT_PLACEHOLDER_TEXT)).toBeTruthy();
      });
    });

    describe('CommentView', () => {
      it('shows correct comment view text', async () => {
        const expectedRating = 4;
        wrapper = await mountFormWithFeedbackState({
          view: 'comment',
          sentiment: 'Positive',
          rating: expectedRating,
          comment: '',
        });
        // Check that present rating is shown
        const highlightedStars = wrapper.getAllByTestId('rating-star-highlighted');
        const unselectedStar = wrapper.getAllByTestId('rating-star');
        expect(highlightedStars).toHaveLength(expectedRating);
        expect(unselectedStar).toHaveLength(5 - expectedRating);

        expect(wrapper.getByPlaceholderText(EMAIL_PLACEHOLDER_TEXT)).toBeTruthy();
        expect(wrapper.getByText('Send')).toBeTruthy();
      });

      describe('when the Screenshot button is clicked', () => {
        it('shows the overlays and adds event listener', async () => {
          wrapper = await mountFormWithFeedbackState({
            view: 'comment',
            comment: 'This is a test comment.',
            user: { email: 'test@example.com' },
          });

          // click on screenshot button; use closest() because of LG implementation of `"pointer-events": "none"`
          userEvent.click(wrapper.getByText(SCREENSHOT_BUTTON_TEXT).closest('button'));
          await tick();

          expect(screenshotFunctionMocks['addEventListener']).toHaveBeenCalled();

          // shows overlays
          expect(
            wrapper.getByAltText(SCREENSHOT_OVERLAY_ALT_TEXT).getElementsByClassName('overlay-instructions')
          ).toBeTruthy();
        });

        it('adds the screenshot attachment on send', async () => {
          wrapper = await mountFormWithFeedbackState({
            view: 'comment',
            comment: 'This is a test comment.',
            sentiment: 'Positive',
            user: { email: 'test@example.com' },
            screenshotTaken: true,
          });

          userEvent.click(wrapper.getByText(FEEDBACK_SUBMIT_BUTTON_TEXT).closest('button'));
          await tick();

          expect(screenshotFunctionMocks['retrieveDataUri']).toHaveBeenCalled();
        });
      });

      describe('when the Send button is clicked', () => {
        it('submits the feedback and transitions to the submitted view if the inputs are valid', async () => {
          wrapper = await mountFormWithFeedbackState({
            view: 'comment',
            comment: 'This is a test comment.',
            sentiment: 'Positive',
            rating: 5,
            user: { email: 'test@example.com' },
          });
          // Click the submit button
          userEvent.click(wrapper.getByText(FEEDBACK_SUBMIT_BUTTON_TEXT).closest('button'));
          await tick();
          expect(stitchFunctionMocks['createNewFeedback']).toHaveBeenCalledTimes(1);
        });

        it('raises an input error if an invalid email is specified', async () => {
          wrapper = await mountFormWithFeedbackState({
            view: 'comment',
            comment: '',
            user: { email: 'test invalid email' },
          });
          // Type in an invalid email address
          const emailInput = wrapper.getByPlaceholderText(EMAIL_PLACEHOLDER_TEXT);
          userEvent.paste(emailInput, 'invalid email address');
          // Click the submit button
          userEvent.click(wrapper.getByText(FEEDBACK_SUBMIT_BUTTON_TEXT).closest('button'));
          await tick();
          expect(wrapper.getByText(EMAIL_ERROR_TEXT)).toBeTruthy();
        });
      });
    });

    describe('SubmittedView', () => {
      const standardViewCopy = [
        SUBMITTED_VIEW_TEXT.HEADING,
        SUBMITTED_VIEW_TEXT.SUB_HEADING,
        ...SUBMITTED_VIEW_RESOURCE_LINKS.map(({ text }) => text),
      ];
      const negativeViewCopy = [SUBMITTED_VIEW_TEXT.SUPPORT_CTA, SUBMITTED_VIEW_SUPPORT_LINK.text];

      it('shows self-serve support links for negative path', async () => {
        wrapper = await mountFormWithFeedbackState({
          sentiment: 'Negative',
          rating: 1,
          view: 'submitted',
        });
        const viewCopy = [...standardViewCopy, ...negativeViewCopy];
        viewCopy.forEach((text) => {
          expect(wrapper.getByText(text)).toBeTruthy();
        });
      });

      it('shows summary information for positive path', async () => {
        wrapper = await mountFormWithFeedbackState({
          sentiment: 'Positive',
          rating: 5,
          view: 'submitted',
        });
        standardViewCopy.forEach((text) => {
          expect(wrapper.getByText(text)).toBeTruthy();
        });
        negativeViewCopy.forEach((text) => {
          expect(wrapper.queryAllByText(text)).toHaveLength(0);
        });
      });
    });
  });
});
