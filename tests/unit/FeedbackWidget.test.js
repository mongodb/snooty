import React from 'react';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  FeedbackProvider,
  FeedbackForm,
  FeedbackTab,
  FeedbackFooter,
} from '../../src/components/Widgets/FeedbackWidget';
import { matchers } from '@emotion/jest';

import { tick, mockMutationObserver, mockSegmentAnalytics, setDesktop, setMobile, setTablet } from '../utils';
import {
  stitchFunctionMocks,
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
      expect(wrapper.queryAllByText('Share Feedback')[0]).toHaveStyleRule('left', '20px', {
        media: `${theme.screenSize.upToSmall}`,
      });
    });
  });

  describe('FeedbackHeading (Mobile Viewport)', () => {
    it('is visible on medium/tablet screens', async () => {
      setTablet();
      wrapper = await mountFormWithFeedbackState({});
      expect(wrapper.queryAllByText('Share Feedback')).toHaveLength(2);
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
      });
      // Click the close button
      userEvent.click(wrapper.getByLabelText('Close Feedback Form'));
      await tick();
      expect(wrapper.queryAllByText('Did this page help?')).toHaveLength(0);
    });

    describe('SentimentView', () => {
      it('Shows 3 sentiment categories', async () => {
        wrapper = await mountFormWithFeedbackState({
          view: 'sentiment',
        });
        expect(wrapper.queryAllByText('Yes, it did!')).toHaveLength(1);
        expect(wrapper.queryAllByText('No, I have feedback.')).toHaveLength(1);
        expect(wrapper.queryAllByText('I have a suggestion.')).toHaveLength(1);
      });

      it('transitions to the negative path comment view when a negative category is clicked', async () => {
        wrapper = await mountFormWithFeedbackState({
          view: 'sentiment',
        });
        userEvent.click(wrapper.queryByText('No, I have feedback.'));
        await tick();
        expect(wrapper.getByText('Unhelpful')).toBeTruthy();
        expect(wrapper.getByPlaceholderText('How could this page be more helpful?')).toBeTruthy();
      });

      it('transitions to the positive path comment view when a positive category is clicked', async () => {
        wrapper = await mountFormWithFeedbackState({
          view: 'sentiment',
        });
        userEvent.click(wrapper.queryByText('Yes, it did!'));
        await tick();
        expect(wrapper.getByText('Helpful')).toBeTruthy();
        expect(wrapper.getByPlaceholderText('How did this page help you?')).toBeTruthy();
      });

      it('transitions to the suggestion path comment view when a suggestion category is clicked', async () => {
        wrapper = await mountFormWithFeedbackState({
          view: 'sentiment',
        });
        userEvent.click(wrapper.queryByText('I have a suggestion.'));
        await tick();
        expect(wrapper.getByText('Idea')).toBeTruthy();
        expect(wrapper.getByPlaceholderText('What change would you like to see?')).toBeTruthy();
      });
    });

    describe('CommentView', () => {
      it('shows correct comment view text', async () => {
        wrapper = await mountFormWithFeedbackState({
          view: 'comment',
          sentiment: 'Positive',
          comment: '',
        });
        expect(wrapper.getByPlaceholderText('Email Address')).toBeTruthy();
        expect(wrapper.getByText('Send')).toBeTruthy();
      });

      describe('when the Screenshot button is clicked', () => {
        it('shows the overlays and adds event listener', async () => {
          wrapper = await mountFormWithFeedbackState({
            view: 'comment',
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
            comment: 'This is a test comment.',
            sentiment: 'Positive',
            user: { email: 'test@example.com' },
            screenshotTaken: true,
          });

          userEvent.click(wrapper.getByText('Send').closest('button'));
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
            user: { email: 'test@example.com' },
          });
          // Click the submit button
          userEvent.click(wrapper.getByText('Send').closest('button'));
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
          const emailInput = wrapper.getByPlaceholderText('Email Address');
          userEvent.paste(emailInput, 'invalid email address');
          // Click the submit button
          userEvent.click(wrapper.getByText('Send').closest('button'));
          await tick();
          expect(wrapper.getByText('Please enter a valid email.')).toBeTruthy();
        });
      });
    });

    describe('SubmittedView', () => {
      it('shows self-serve support links for negative path', async () => {
        wrapper = await mountFormWithFeedbackState({
          sentiment: 'Negative',
          view: 'submitted',
        });
        expect(wrapper.getByText("We're sorry to hear that.")).toBeTruthy();
        expect(wrapper.getByText('Looking for more resources?')).toBeTruthy();
        expect(wrapper.getByText('MongoDB Community')).toBeTruthy();
        expect(wrapper.getByText('MongoDB Developer Center')).toBeTruthy();
        expect(wrapper.getByText('Have a support contract?')).toBeTruthy();
        expect(wrapper.getByText('Create a Support Case')).toBeTruthy();
      });

      it('shows summary information for positive path', async () => {
        wrapper = await mountFormWithFeedbackState({
          sentiment: 'Positive',
          view: 'submitted',
        });
        expect(wrapper.getByText('Thanks for your help!')).toBeTruthy();
        expect(wrapper.getByText('MongoDB Community')).toBeTruthy();
        expect(wrapper.getByText('MongoDB Developer Center')).toBeTruthy();
        expect(wrapper.queryAllByText('Have a support contract?')).toHaveLength(0);
        expect(wrapper.queryAllByText('Create a Support Case')).toHaveLength(0);
      });
    });
  });
});
