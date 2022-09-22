import React, { useState, useContext, createContext } from 'react';
import { createNewFeedback, useStitchUser } from './stitch';
import { getSegmentUserId } from '../../../utils/segment';
import { getViewport } from '../../../hooks/useViewport';

const FeedbackContext = createContext();

export function FeedbackProvider({ page, hideHeader, test = {}, ...props }) {
  const [feedback, setFeedback] = useState((test.feedback !== {} && test.feedback) || null);
  const [selectedSentiment, selectSentiment] = useState(test.feedback?.sentiment || null);
  const [view, setView] = useState(test.view || 'waiting');
  const [screenshotTaken, setScreenshotTaken] = useState(test.screenshotTaken || false);
  const [progress, setProgress] = useState([true, false, false]);
  const user = useStitchUser();

  // Create a new feedback document
  const initializeFeedback = (nextView = 'sentiment') => {
    const newFeedback = {};
    setFeedback({ newFeedback });
    setView(nextView);
    setProgress([true, false, false]);
    return { newFeedback };
  };

  // Once a user has selected the sentiment category, show them the comment/email input boxes.
  const setSentiment = (sentiment) => {
    selectSentiment(sentiment);
    if (view !== 'comment' && sentiment) {
      setView('comment');
      setProgress([true, true, false]);
    }
  };

  const submitAllFeedback = async ({ comment = '', email = '', snootyEnv, dataUri, viewport }) => {
    // Route the user to their "next steps"

    setProgress([true, true, true]);
    setView('submitted');

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
      attachment: {
        dataUri,
        viewport,
      },
      viewport: getViewport(),
      comment,
      category: selectedSentiment,
      snootyEnv,
      ...test.feedback,
    };

    await createNewFeedback(newFeedback);

    setFeedback(newFeedback);
  };

  // Stop giving feedback (if in progress) and reset the widget to the
  // initial state.
  const abandon = () => {
    // Reset to the initial state
    setView('waiting');
    if (feedback) {
      // set the sentiment and feedback to null
      setFeedback(null);
      selectSentiment(null);
    }
  };

  const value = {
    feedback,
    progress,
    view,
    setScreenshotTaken,
    screenshotTaken,
    selectedSentiment,
    initializeFeedback,
    selectSentiment,
    setSentiment,
    setProgress,
    submitAllFeedback,
    abandon,
    hideHeader,
  };

  return <FeedbackContext.Provider value={value}>{props.children}</FeedbackContext.Provider>;
}

export const useFeedbackContext = () => {
  const feedback = useContext(FeedbackContext);
  if (!feedback && feedback !== null) {
    throw new Error('You must nest useFeedbackContext() inside of a FeedbackProvider.');
  }
  return feedback;
};
