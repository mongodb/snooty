import React from 'react';
import { act } from 'react-dom/test-utils';
import { mount } from 'enzyme';
import { FeedbackProvider, useFeedbackState } from '../../src/components/FeedbackWidget/context';
import { FEEDBACK_QUALIFIERS_NEGATIVE } from './data/FeedbackWidget';
import screenshot from './data/screenshot.test.json';
import {
  tick,
  mockSegmentAnalytics,
  stitch_function_mocks,
  mockStitchFunctions,
  clearMockStitchFunctions,
} from './FeedbackWidget.test.js';

const FeedbackStateTest = () => {
  const {
    feedback,
    view,
    isSupportRequest,
    initializeFeedback,
    setRating,
    setQualifier,
    submitQualifiers,
    submitComment,
    submitScreenshot,
    submitSupport,
    abandon,
  } = useFeedbackState();
  return (
    <>
      <div id="view" value={view} />
      <div id="isSupportRequest" value={isSupportRequest} />
      {feedback && (
        <div id="feedback">
          {feedback.page && (
            <>
              <div id="page-title" value={feedback.page.title} />
              <div id="page-slug" value={feedback.page.slug} />
              <div id="page-url" value={feedback.page.url} />
              <div id="page-docs_property" value={feedback.page.docs_property} />
              <div id="page-docs_version" value={feedback.page.docs_version} />
            </>
          )}
          {feedback.user && (
            <>
              <div id="user-stitch_id" value={feedback.user.stitch_id} />
              <div id="user-segment_id" value={feedback.user.segment_id} />
              <div id="user-isAnonymous" value={feedback.user.isAnonymous} />
              <div id="user-email" value={feedback.user.email} />
            </>
          )}
          <div id="comment" value={feedback.comment} />
          <div id="viewport" value={feedback.viewport} />
          <div id="rating" value={feedback.rating} />
          {feedback.qualifiers && (
            <div id="qualifiers">
              {feedback.qualifiers.map(q => (
                <div key={q.id} qualifier_id={q.id} id={`qualifier-${q.displayOrder}`} value={q.value} />
              ))}
            </div>
          )}
        </div>
      )}
      <button id="initializeFeedback" onClick={() => initializeFeedback()} />
      <button id="setRating" onClick={rating => setRating(rating)} />
      <button id="setQualifier" onClick={(id, value) => setQualifier(id, value)} />
      <button id="submitQualifiers" onClick={() => submitQualifiers()} />
      <button id="submitComment" onClick={({ comment, email }) => submitComment({ comment, email })} />
      <button id="submitScreenshot" onClick={({ dataUri, viewport }) => submitScreenshot({ dataUri, viewport })} />
      <button id="submitSupport" onClick={() => submitSupport()} />
      <button id="abandon" onClick={() => abandon()} />
    </>
  );
};

const mockFeedback = {
  page: {
    title: 'Test Page Please Ignore',
    slug: '/test',
    url: 'https://docs.mongodb.com/test',
    docs_property: 'test',
  },
  user: {
    email: '',
  },
  rating: null,
  comment: '',
  qualifiers: [],
};

async function mountTest(data = {}) {
  const { view, isSupportRequest, ...feedback } = data;
  const wrapper = await mount(
    <FeedbackProvider
      page={mockFeedback.page}
      test={{
        view,
        isSupportRequest,
        feedback: Object.keys(feedback).length ? feedback : null,
      }}
    >
      <FeedbackStateTest />
    </FeedbackProvider>
  );
  return wrapper;
}

describe('useFeedbackState', () => {
  jest.useFakeTimers();
  beforeAll(mockSegmentAnalytics);
  beforeEach(mockStitchFunctions);
  afterEach(clearMockStitchFunctions);

  it('starts in the "waiting" view with no feedback initialized', async () => {
    const wrapper = await mountTest({});
    expect(wrapper.find('#view').prop('value')).toBe('waiting');
    expect(wrapper.exists('#feedback')).toBe(false);
  });

  it('initializes feedback and transitions to the "rating" view', async () => {
    const wrapper = await mountTest({});
    await act(async () => {
      wrapper.find('button#initializeFeedback').simulate('click');
      await tick();
    });
    wrapper.update();
    expect(wrapper.find('#view').prop('value')).toBe('rating');
    expect(wrapper.exists('#feedback')).toBe(true);
    expect(stitch_function_mocks['createNewFeedback']).toHaveBeenCalledTimes(1);
  });

  it('sets the feedback rating and transitions to the "qualifiers" view', async () => {
    const wrapper = await mountTest({
      view: 'rating',
      ...mockFeedback,
    });
    expect(wrapper.find('#rating').prop('value')).toBe(null);
    await act(async () => {
      wrapper.find('button#setRating').prop('onClick')(3);
      await tick();
    });
    wrapper.update();
    expect(wrapper.find('#rating').prop('value')).toBe(3);
    expect(wrapper.find('#view').prop('value')).toBe('qualifiers');
    expect(stitch_function_mocks['updateFeedback']).toHaveBeenCalledTimes(1);
  });

  it('selects and unselects qualifiers', async () => {
    const wrapper = await mountTest({
      view: 'qualifiers',
      ...mockFeedback,
      rating: 3,
      qualifiers: FEEDBACK_QUALIFIERS_NEGATIVE,
    });
    expect(wrapper.find('#qualifiers').children()).toHaveLength(4);
    expect(wrapper.exists('#qualifier-1')).toBe(true);
    expect(wrapper.find('#qualifier-1').prop('value')).toBe(false);
    await act(async () => {
      wrapper.find('button#setQualifier').prop('onClick')(
        wrapper.find('#qualifier-1').prop('qualifier_id'),
        !wrapper.find('#qualifier-1').prop('value')
      );
      await tick();
    });
    wrapper.update();
    expect(wrapper.find('#qualifier-1').prop('value')).toBe(true);
    // The qualifiers auto-save when they're set
    expect(stitch_function_mocks['updateFeedback']).toHaveBeenCalledTimes(1);

    await act(async () => {
      wrapper.find('button#setQualifier').prop('onClick')(
        wrapper.find('#qualifier-1').prop('qualifier_id'),
        !wrapper.find('#qualifier-1').prop('value')
      );
      await tick();
    });
    wrapper.update();
    expect(wrapper.find('#qualifier-1').prop('value')).toBe(false);
    // The qualifiers auto-save when they're set
    expect(stitch_function_mocks['updateFeedback']).toHaveBeenCalledTimes(2);
  });

  it('submits qualifiers and transitions to the "comments" view', async () => {
    const wrapper = await mountTest({
      view: 'qualifiers',
      ...mockFeedback,
      rating: 3,
      qualifiers: FEEDBACK_QUALIFIERS_NEGATIVE,
    });
    await act(async () => {
      wrapper.find('button#submitQualifiers').simulate('click');
      await tick();
    });
    wrapper.update();
    expect(wrapper.find('#view').prop('value')).toBe('comment');
    // The qualifiers auto-save when they're set, so this doesn't actually update the feedback
    expect(stitch_function_mocks['updateFeedback']).toHaveBeenCalledTimes(0);
  });

  it('submits a comment', async () => {
    const wrapper = await mountTest({
      view: 'comment',
      ...mockFeedback,
      rating: 3,
      qualifiers: FEEDBACK_QUALIFIERS_NEGATIVE,
    });
    expect(wrapper.find('#comment').prop('value')).toBe('');
    await act(async () => {
      wrapper.find('button#submitComment').prop('onClick')({ comment: 'Test Comment' });
      await tick();
    });
    wrapper.update();
    expect(wrapper.find('#comment').prop('value')).toBe('Test Comment');
    expect(stitch_function_mocks['updateFeedback']).toHaveBeenCalledTimes(1);
  });

  it('submits a user email', async () => {
    const wrapper = await mountTest({
      view: 'comment',
      ...mockFeedback,
      rating: 3,
      qualifiers: FEEDBACK_QUALIFIERS_NEGATIVE,
    });
    expect(wrapper.find('#user-email').prop('value')).toBe('');
    await act(async () => {
      wrapper.find('button#submitComment').prop('onClick')({ comment: '', email: 'test@example.com' });
      await tick();
    });
    wrapper.update();
    expect(wrapper.find('#user-email').prop('value')).toBe('test@example.com');
    expect(stitch_function_mocks['updateFeedback']).toHaveBeenCalledTimes(1);
  });

  it('attaches a screenshot', async () => {
    const wrapper = await mountTest({
      view: 'comment',
      ...mockFeedback,
      rating: 3,
      qualifiers: FEEDBACK_QUALIFIERS_NEGATIVE,
    });
    await act(async () => {
      wrapper.find('button#submitScreenshot').prop('onClick')(screenshot);
      await tick();
    });
    wrapper.update();
    expect(stitch_function_mocks['addAttachment']).toHaveBeenCalledTimes(1);
  });

  it('marks feedback as abandoned and resets state', async () => {
    const wrapper = await mountTest({
      view: 'comment',
      ...mockFeedback,
      rating: 3,
      qualifiers: FEEDBACK_QUALIFIERS_NEGATIVE,
    });
    expect(wrapper.find('#view').prop('value')).toBe('comment');
    await act(async () => {
      wrapper.find('button#abandon').prop('onClick')();
      await tick();
    });
    wrapper.update();
    expect(wrapper.find('#view').prop('value')).toBe('waiting');
    expect(stitch_function_mocks['abandonFeedback']).toHaveBeenCalledTimes(1);
  });
});
