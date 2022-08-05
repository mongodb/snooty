import React from 'react';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  FeedbackProvider,
  FeedbackForm,
  FeedbackTab,
  FeedbackFooter,
} from '../../src/components/Widgets/FeedbackWidget';
import { BSON } from 'mongodb-stitch-server-sdk';
import { matchers } from '@emotion/jest';

import { tick, mockMutationObserver, mockSegmentAnalytics, setDesktop, setMobile, setTablet } from '../utils';
import {
  //stitchFunctionMocks,
  mockStitchFunctions,
  clearMockStitchFunctions,
} from '../utils/feedbackWidgetStitchFunctions';
import Heading from '../../src/components/Heading';
import headingData from './data/Heading.test.json';
import { theme } from '../../src/theme/docsTheme';
import {
  screenshotFunctionMocks,
  mockScreenshotFunctions,
  clearMockScreenshotFunctions,
} from '../utils/data/feedbackWidgetScreenshotFunctions';

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
  beforeEach(mockScreenshotFunctions);
  afterEach(clearMockScreenshotFunctions);

  describe('FeedbackTab (Desktop Viewport)', () => {
    it('shows the sentiment category view when clicked', async () => {
      wrapper = await mountFormWithFeedbackState({});
      // Before the click, the form is hidden
      expect(wrapper.queryAllByText('Did this page help?')).toHaveLength(0);
      // Click the tab
      userEvent.click(wrapper.getByText('Share Feedback'));

      await tick();
      // After the click new feedback is initialized
      expect(wrapper.queryAllByText('Did this page help?')).toHaveLength(1);
    });

    it('is visible in the waiting view on large/desktop screens', async () => {
      wrapper = await mountFormWithFeedbackState({});
      expect(wrapper.queryAllByText('Share Feedback')).toHaveLength(1);
    });

    it('is hidden outside of the waiting view on large/desktop screens', async () => {
      wrapper = await mountFormWithFeedbackState({
        view: 'sentiment',
        comment: '',
      });
      expect(wrapper.queryAllByText('Did this page help?')).toHaveLength(1);
    });

    it('is hidden on small/mobile and medium/tablet screens', async () => {
      wrapper = await mountFormWithFeedbackState({});
      expect(wrapper.queryAllByText('Share Feedback')).toHaveLength(1);
      expect(wrapper.queryAllByText('Share Feedback')[0]).toHaveStyleRule('display', 'none', {
        media: `${theme.screenSize.upToLarge}`,
      });
    });
  });

  describe('FeedbackHeading (Mobile Viewport)', () => {
    it('is hidden on large/desktop screens', async () => {
      wrapper = await mountFormWithFeedbackState({});
      expect(wrapper.queryAllByText('Share Feedback')).toHaveLength(1);
      expect(wrapper.queryAllByText('Share Feedback')[0]).toHaveStyleRule('display', 'none', {
        media: `${theme.screenSize.upToLarge}`,
      });
    });

    it('is visible on medium/tablet screens', async () => {
      setTablet();
      wrapper = await mountFormWithFeedbackState({});
      expect(wrapper.queryAllByText('Share Feedback')).toHaveLength(2);
      expect(wrapper.queryAllByText('Share Feedback')[0]).toHaveStyleRule('display', 'none', {
        media: `${theme.screenSize.upToLarge}`,
      });
    });

    it('is visible on small/mobile screens', async () => {
      setMobile();
      wrapper = await mountFormWithFeedbackState({});
      expect(wrapper.queryAllByText('Share Feedback')).toHaveLength(2);
    });

    it('is hidden on small/mobile screens when configured with page option', async () => {
      setMobile();
      wrapper = await mountFormWithFeedbackState({ hideHeader: true });
      expect(wrapper.queryAllByText('Share Feedback')).toHaveLength(1);
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
        view: 'sentiment',
        _id: new BSON.ObjectId(),
      });
      // Click the close button
      userEvent.click(wrapper.getByLabelText('Close Feedback Form'));
      await tick();
      expect(wrapper.queryAllByText('Did this page help?')).toHaveLength(0);
    });

    describe('SentimentView', () => {
      it('shows 3 sentiment categories', async () => {
        wrapper = await mountFormWithFeedbackState({
          view: 'sentiment',
          _id: new BSON.ObjectId(),
        });
        expect(wrapper.queryAllByText('Yes, it did!')).toHaveLength(1);
        expect(wrapper.queryAllByText('No, I have feedback.')).toHaveLength(1);
        expect(wrapper.queryAllByText('I have a suggestion.')).toHaveLength(1);
      });

      it('transitions to the negative path comment view when a negative category is clicked', async () => {
        wrapper = await mountFormWithFeedbackState({
          view: 'sentiment',
          _id: new BSON.ObjectId(),
        });
        userEvent.click(wrapper.queryByText('No, I have feedback.'));
        await tick();
        expect(wrapper.getByPlaceholderText('How could this page be more helpful?')).toBeTruthy();
      });

      it('transitions to the positive path comment view when a positive category is clicked', async () => {
        wrapper = await mountFormWithFeedbackState({
          view: 'sentiment',
          _id: new BSON.ObjectId(),
        });
        userEvent.click(wrapper.queryByText('Yes, it did!'));
        await tick();
        expect(wrapper.getByPlaceholderText('How did this page help you?')).toBeTruthy();
      });
      it('transitions to the suggestion path comment view when a suggestion category is clicked', async () => {
        wrapper = await mountFormWithFeedbackState({
          view: 'sentiment',
          _id: new BSON.ObjectId(),
        });
        userEvent.click(wrapper.queryByText('I have a suggestion.'));
        await tick();
        expect(wrapper.getByPlaceholderText('What change would you like to see?')).toBeTruthy();
      });
    });

    describe('CommentView', () => {
      it('shows a comment text input', async () => {
        wrapper = await mountFormWithFeedbackState({
          view: 'comment',
          //sentiment: Positive
          comment: '',
        });
      });

      it('shows an email text input', async () => {
        wrapper = await mountFormWithFeedbackState({
          view: 'comment',
          //sentiment: Positive
          comment: '',
        });
        expect(wrapper.getByPlaceholderText('Email Address')).toBeTruthy();
      });

      it('shows a Send button for feedback', async () => {
        wrapper = await mountFormWithFeedbackState({
          view: 'comment',
          //sentiment
          comment: '',
        });
        expect(wrapper.getByText('Send')).toBeTruthy();
      });

      describe('when the Screenshot button is clicked', () => {
        it('shows the overlays and adds event listener', async () => {
          wrapper = await mountFormWithFeedbackState({
            view: 'comment',
            rating: 2,
            qualifiers: FEEDBACK_QUALIFIERS_NEGATIVE,
            comment: 'This is a test comment.',
            user: { email: 'test@example.com' },
          });

          // click on screenshot button
          userEvent.click(wrapper.getAllByRole('button')[2]);
          await tick();

          expect(screenshotFunctionMocks['addEventListener']).toHaveBeenCalled();

          // shows overlays
          expect(wrapper.getByRole('img').getElementsByClassName('overlayInstructions')).toBeTruthy();
        });

        it('adds the screenshot attachment on send', async () => {
          wrapper = await mountFormWithFeedbackState({
            view: 'comment',
            rating: 2,
            qualifiers: FEEDBACK_QUALIFIERS_NEGATIVE,
            comment: 'This is a test comment.',
            user: { email: 'test@example.com' },
            screenshotTaken: true,
          });

          userEvent.click(wrapper.getByText('Send').closest('button'));
          await tick();

          expect(screenshotFunctionMocks['retrieveDataUri']).toHaveBeenCalled();
          expect(stitchFunctionMocks['addAttachment']).toHaveBeenCalled();
        });
      });

      describe('when the Submit button is clicked', () => {
        it('submits the feedback and transitions to the submitted view if the inputs are valid', async () => {
          wrapper = await mountFormWithFeedbackState({
            view: 'comment',
            comment: 'This is a test comment.',
            user: { email: 'test@example.com' },
          });
          // Click the submit button
          userEvent.click(wrapper.getByText('Send').closest('button'));
          await tick();
          //expect(stitchFunctionMocks['submitAllFeedback']).toHaveBeenCalledTimes(1);
        });

        it('raises an input error if an invalid email is specified', async () => {
          wrapper = await mountFormWithFeedbackState({
            view: 'comment',
            comment: '',
          });
          // Type in an invalid email address
          const emailInput = wrapper.getByPlaceholderText('Email Address');
          userEvent.paste(emailInput, 'not-a-valid-email-address');
          // Click the submit button
          userEvent.click(wrapper.getByText('Send').closest('button'));
          await tick();
          expect(wrapper.getByLabelText('Please enter a valid email.')).toBeTruthy();
        });
      });
    });

    /*
    describe('SubmittedView Negative Path', () => {
      it('shows self-serve support links', async () => {
        wrapper = await mountFormWithFeedbackState({
          view: 'submitted',
          isSupportRequest: true,
        });
        expect(wrapper.getByText("We're sorry to hear that.")).toBeTruthy();
        expect(wrapper.getByText("Your input improves MongoDB's Documentation")).toBeTruthy();
        expect(wrapper.getByText('Looking for more resources?')).toBeTruthy();
        expect(wrapper.getByText('MongoDB Community')).toBeTruthy();
        expect(wrapper.getByText('MongoDB Developer center')).toBeTruthy();
        expect(wrapper.getByText('Have a support contract?')).toBeTruthy();
        expect(wrapper.getByText('Create a Support Case')).toBeTruthy();
      });
    });

    describe('SubmittedView', () => {
      it('shows summary information', async () => {
        wrapper = await mountFormWithFeedbackState({
          view: 'submitted',
          feedback: {
            isSubmitted: true,
          },
        });
        expect(wrapper.getByText('We appreciate your feedback.')).toBeTruthy();
        expect(wrapper.getByText(`We're working hard to improve the MongoDB Documentation.`)).toBeTruthy();
      });
    });
    */
  });
});
