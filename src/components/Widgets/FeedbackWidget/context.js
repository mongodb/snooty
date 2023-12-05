import React, { useState, useContext, createContext } from 'react';
import { getViewport } from '../../../hooks/useViewport';
import { createNewFeedback, useRealmUser } from './realm';

const FeedbackContext = createContext();

export function FeedbackProvider({ page, hideHeader, test = {}, ...props }) {
  const hasExistingFeedback =
    !!test.feedback && typeof test.feedback === 'object' && Object.keys(test.feedback).length > 0;
  const [feedback, setFeedback] = useState((hasExistingFeedback && test.feedback) || null);
  const [selectedRating, setSelectedRating] = useState(test.feedback?.rating || null);
  const [view, setView] = useState(test.view || 'waiting');
  const [screenshotTaken, setScreenshotTaken] = useState(test.screenshotTaken || false);
  const [progress, setProgress] = useState([true, false, false]);
  const user = useRealmUser();

  // Create a new feedback document
  const initializeFeedback = (nextView = 'rating') => {
    const newFeedback = {};
    setFeedback({ newFeedback });
    setView(nextView);
    setProgress([true, false, false]);
    return { newFeedback };
  };

  const selectInitialRating = (ratingValue) => {
    setSelectedRating(ratingValue);
    setView('comment');
    setProgress([false, true, false]);
  };

  // Create a placeholder sentiment based on the selected rating to avoid any breaking changes from external dependencies
  const createSentiment = (selectedRating) => {
    if (selectedRating < 3) {
      return 'Negative';
    } else if (selectedRating === 3) {
      return 'Suggestion';
    } else {
      return 'Positive';
    }
  };

  const submitAllFeedback = async ({ comment = '', email = '', snootyEnv, dataUri, viewport }) => {
    // Route the user to their "next steps"

    setProgress([false, false, true]);
    setView('submitted');

    if (!selectedRating) return;
    // Submit the full feedback document
    const newFeedback = {
      page: {
        title: page.title,
        slug: page.slug,
        url: page.url,
        docs_property: page.docs_property,
      },
      user: {
        stitch_id: user && user.id,
        email: email,
      },
      attachment: {
        dataUri,
        viewport,
      },
      viewport: getViewport(),
      comment,
      category: createSentiment(selectedRating),
      rating: selectedRating,
      snootyEnv,
      ...test.feedback,
    };

    try {
      await createNewFeedback(newFeedback);
      setFeedback(newFeedback);
    } catch (err) {
      console.error('There was an error submitting feedback', err);
    }
  };

  // Stop giving feedback (if in progress) and reset the widget to the
  // initial state.
  const abandon = () => {
    // Reset to the initial state
    setView('waiting');
    if (feedback) {
      // set the rating and feedback to null
      setFeedback(null);
      setSelectedRating(null);
    }
  };

  const value = {
    feedback,
    progress,
    view,
    setScreenshotTaken,
    screenshotTaken,
    initializeFeedback,
    setProgress,
    submitAllFeedback,
    abandon,
    hideHeader,
    selectedRating,
    setSelectedRating,
    selectInitialRating,
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
