import React from 'react';
import { act, render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { matchers } from '@emotion/jest';
import FeedbackWidget, { FeedbackProvider, FeedbackForm } from '../../src/components/Widgets/FeedbackWidget';

import { tick, mockMutationObserver, mockSegmentAnalytics, setDesktop } from '../utils';
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
import { mockLocation } from '../utils/mock-location';
import {
  CLOSE_BUTTON_ALT_TEXT,
  COMMENT_PLACEHOLDER_TEXT,
  EMAIL_ERROR_TEXT,
  EMAIL_PLACEHOLDER_TEXT,
  FEEDBACK_SUBMIT_BUTTON_TEXT,
  RATING_QUESTION_TEXT,
  SCREENSHOT_BUTTON_TEXT,
  SCREENSHOT_OVERLAY_ALT_TEXT,
  SUBMITTED_VIEW_RESOURCE_LINKS,
  SUBMITTED_VIEW_SUPPORT_LINK,
  SUBMITTED_VIEW_TEXT,
} from '../../src/components/Widgets/FeedbackWidget/constants';
import { PageContext } from '../../src/context/page-context';
import { MetadataProvider } from '../../src/utils/use-snooty-metadata';
import headingData from './data/Heading.test.json';

// Mock chatbot context
jest.mock('../../src/context/chatbot-context', () => ({
  useChatbotModal: () => ({
    chatbotClicked: false,
    setChatbotClicked: jest.fn(),
    text: '',
    setText: jest.fn(),
  }),
  ChatbotProvider: ({ children }) => children,
}));

async function mountFormWithFeedbackState(feedbackState = {}) {
  const { view, isSupportRequest, screenshotTaken, ...feedback } = feedbackState;
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
      >
        <FeedbackForm />
        <div>
          <Heading nodeData={headingData} sectionDepth={1} />
        </div>
      </FeedbackProvider>
    </>
  );
  // Need to wait for the next tick to let Loadable components load
  await tick();
  return wrapper;
}

// Finds all of the stars in the rating view and ensures the correct number are shown
const checkSelectedStars = (wrapper, selectedRating) => {
  const maxStars = 5;
  const highlightedStars = wrapper.queryAllByTestId('rating-star-highlighted');
  const unselectedStars = wrapper.queryAllByTestId('rating-star');

  expect(highlightedStars.length + unselectedStars.length).toEqual(maxStars);
  expect(highlightedStars).toHaveLength(selectedRating);
  expect(unselectedStars).toHaveLength(maxStars - selectedRating);
};

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
  beforeEach(() => mockLocation('', '', '', 'https://mongodb.com/docs/atlas'));

  describe('FeedbackWidget', () => {
    it('is not rendered when hidefeedback page option has value "page"', () => {
      const pageContextValue = {
        options: {
          hidefeedback: 'page',
        },
      };

      wrapper = render(
        <PageContext.Provider value={pageContextValue}>
          <MetadataProvider metadata={{}}>
            <FeedbackWidget slug={'/'} />
          </MetadataProvider>
        </PageContext.Provider>
      );

      // Should not be rendered
      expect(wrapper.queryByTestId('feedback-container')).not.toBeInTheDocument();
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

    describe('RatingView', () => {
      it('Shows 5 stars for rating', async () => {
        wrapper = await mountFormWithFeedbackState({
          view: 'rating',
        });
        expect(wrapper.getAllByTestId('rating-star')).toHaveLength(5);
      });

      it('transitions to the comment view and submits a feedback when a rating is clicked', async () => {
        wrapper = await mountFormWithFeedbackState({
          view: 'rating',
        });
        const stars = wrapper.getAllByTestId('rating-star');
        const selectedRating = 5;
        const selectedStar = stars[selectedRating - 1];
        userEvent.click(selectedStar);
        await tick();

        checkSelectedStars(wrapper, selectedRating);
        expect(wrapper.getByPlaceholderText(COMMENT_PLACEHOLDER_TEXT)).toBeTruthy();
        expect(stitchFunctionMocks['upsertFeedback']).toHaveBeenCalledTimes(1);
      });

      it('transitions to the comment view when using keyboard to select a rating', async () => {
        wrapper = await mountFormWithFeedbackState({
          view: 'rating',
        });
        const stars = wrapper.getAllByTestId('rating-star');
        const selectedRating = 4;
        const selectedStar = stars[selectedRating - 1];
        // Wrap in `act` due to multiple state changes
        await act(async () => {
          selectedStar.focus();
          userEvent.keyboard('{Enter}');
        });

        checkSelectedStars(wrapper, selectedRating);
        expect(wrapper.getByPlaceholderText(COMMENT_PLACEHOLDER_TEXT)).toBeTruthy();
        expect(stitchFunctionMocks['upsertFeedback']).toHaveBeenCalledTimes(1);
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
        checkSelectedStars(wrapper, expectedRating);

        expect(wrapper.getByPlaceholderText(EMAIL_PLACEHOLDER_TEXT)).toBeTruthy();
        expect(wrapper.getByText('Send')).toBeTruthy();
      });

      describe('when the Screenshot button is clicked', () => {
        it('shows the overlays and adds event listener', async () => {
          wrapper = await mountFormWithFeedbackState({
            view: 'comment',
            comment: 'This is a test comment.',
            user: { email: 'test@example.com' },
            rating: 5,
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
          expect(stitchFunctionMocks['upsertFeedback']).toHaveBeenCalledTimes(1);
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

        it('attempts to resubmit on 401 error', async () => {
          const customError = new Error('mock error message');
          customError.statusCode = 401;
          stitchFunctionMocks['upsertFeedback'].mockRejectedValueOnce(customError);

          wrapper = await mountFormWithFeedbackState({
            view: 'comment',
            comment: 'This is a test comment.',
            sentiment: 'Positive',
            rating: 5,
            user: { email: 'test@example.com' },
          });
          userEvent.click(wrapper.getByText(FEEDBACK_SUBMIT_BUTTON_TEXT).closest('button'));
          await tick();
          expect(stitchFunctionMocks['upsertFeedback']).toHaveBeenCalledTimes(2);
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
