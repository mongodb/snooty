import React, { useState, useContext, createContext } from 'react';
import { createNewFeedback, useStitchUser, addAttachment } from './stitch';
import { getSegmentUserId } from '../../../utils/segment';
import { getViewport } from '../../../hooks/useViewport';

const FeedbackContext = createContext();

export function FeedbackProvider({ page, hideHeader, test = {}, ...props }) {
  const [feedback, setFeedback] = useState((test.feedback !== {} && test.feedback) || null);
  const [selectedSentiment, selectSentiment] = useState(test.feedback?.sentiment || null);
  const [isSupportRequest, setIsSupportRequest] = useState(test.isSupportRequest || false);
  const [view, setView] = useState(test.view || 'waiting');
  const [screenshotTaken, setScreenshotTaken] = useState(test.screenshotTaken || false);
  const [progress, setProgress] = useState([true, false, false]);
  const user = useStitchUser();

  // Create a new feedback document
  async function initializeFeedback(nextView = 'sentiment') {
    //const segment = getSegmentUserId();
    const newFeedback = {};
    setFeedback({ newFeedback });
    setView(nextView);
    setProgress([true, false, false]);
    return { newFeedback };
  }

  // Once a user has selected the sentiment category, show them the comment/email input boxes.
  async function setSentiment(sentiment) {
    selectSentiment(sentiment);
    if (view !== 'comment' && sentiment) {
      setView('comment');
      setProgress([true, true, false]);
    }
  }

  // deprecated
  async function setRating(ratingValue) {
    return;
  }

  // Upload a screenshot to S3 and attach it to the feedback
  async function submitScreenshot({ dataUri, viewport }) {
    if (!selectedSentiment) return;
    const updatedFeedback = await addAttachment({
      feedback_id: feedback._id,
      attachment: { type: 'screenshot', dataUri, viewport },
    });
    setFeedback(updatedFeedback);
  }

  async function submitAllFeedback({ comment = '', email = '', snootyEnv }) {
    // Route the user to their "next steps"

    setProgress([true, true, true]);
    setView('submitted');
    //const dbName = snootyEnv === 'production' ? 'quiz_prod' : 'quiz_dev';

    if (!selectedSentiment) return;
    // Submit the full feedback document
    const segment = getSegmentUserId();
    const newFeedback = {
      page: {
        title: page.title,
        slug: page.slug,
        url: page.url,
        docs_property: page.docs_property,
      },
      user: {
        segment_id: segment.id,
        isAnonymous: segment.isAnonymous,
        stitch_id: user && user.id,
        email: email,
      },
      viewport: getViewport(),
      comment,
      category: selectedSentiment,
      snootyEnv,
      ...test.feedback,
    };

    await createNewFeedback(newFeedback);

    setFeedback(newFeedback);
  }

  // Stop giving feedback (if in progress) and reset the widget to the
  // initial state.
  async function abandon() {
    // Reset to the initial state
    setView('waiting');
    if (feedback) {
      // set the sentiment and feedback to null
      setFeedback(null);
      selectSentiment(null);
    }
  }

  const value = {
    feedback,
    progress,
    view,
    setScreenshotTaken,
    screenshotTaken,
    isSupportRequest,
    selectedSentiment,
    initializeFeedback,
    setRating,
    selectSentiment,
    setSentiment,
    setProgress,
    submitScreenshot,
    submitAllFeedback,
    abandon,
    hideHeader,
  };

  return <FeedbackContext.Provider value={value}>{props.children}</FeedbackContext.Provider>;
}

export function useFeedbackState() {
  const feedback = useContext(FeedbackContext);
  if (!feedback && feedback !== null) {
    throw new Error('You must nest useFeedbackState() inside of a FeedbackProvider.');
  }
  return feedback;
}
