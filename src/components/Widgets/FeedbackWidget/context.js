import React, { useState, useCallback, useContext, useEffect, createContext, useTransition } from 'react';
import { useLocation } from '@gatsbyjs/reach-router';
import { getViewport } from '../../../hooks/useViewport';
import { useSiteMetadata } from '../../../hooks/use-site-metadata';
import { STYLED_RIGHT_COLUMN } from '../../RightColumn';
import { upsertFeedback, useRealmUser } from './realm';

const FeedbackContext = createContext();

export function FeedbackProvider({ page, test = {}, ...props }) {
  const hasExistingFeedback =
    !!test.feedback && typeof test.feedback === 'object' && Object.keys(test.feedback).length > 0;
  const [feedback, setFeedback] = useState(() => (hasExistingFeedback && test.feedback) || undefined);
  const [feedbackId, setFeedbackId] = useState(() => undefined);
  const [selectedRating, setSelectedRating] = useState(test.feedback?.rating || undefined);
  const [view, setView] = useState(test.view || 'waiting');
  const [screenshotTaken, setScreenshotTaken] = useState(test.screenshotTaken || false);
  const [progress, setProgress] = useState([true, false, false]);
  const [isScreenshotButtonClicked, setIsScreenshotButtonClicked] = useState(false);
  const [, startTransition] = useTransition();
  const { user, reassignCurrentUser } = useRealmUser();
  const { href } = useLocation();
  const { snootyEnv } = useSiteMetadata();

  const createFeedbackPayload = useCallback(
    (rating, email, dataUri, viewport, comment) => {
      const res = {
        page: {
          title: page.title,
          slug: page.slug,
          url: page.url,
          docs_property: page.docs_property,
        },
        user: {},
        attachment: {},
        viewport: getViewport(),
        comment,
        category: createSentiment(rating),
        rating: rating,
        snootyEnv,
        ...test.feedback,
      };
      if (user && user.id) {
        res.user.stitch_id = user.id;
      }
      if (email) {
        res.user.email = email;
      }
      if (dataUri) {
        res.attachment.dataUri = dataUri;
      }
      if (dataUri) {
        res.attachment.viewport = viewport;
      }
      if (feedbackId) {
        res.feedback_id = feedbackId;
      }

      return res;
    },
    [feedbackId, page.docs_property, page.slug, page.title, page.url, snootyEnv, test.feedback, user]
  );

  // Create a new feedback document
  const initializeFeedback = (nextView = 'rating') => {
    const newFeedback = {};
    startTransition(() => {
      setFeedback(newFeedback);
      setView(nextView);
      setProgress([true, false, false]);
      setSelectedRating();
    });
    return { newFeedback };
  };

  const selectInitialRating = async (ratingValue) => {
    setSelectedRating(ratingValue);
    setView('comment');
    setProgress([false, true, false]);
    const payload = createFeedbackPayload(ratingValue);
    try {
      const res = await upsertFeedback(payload);
      setFeedbackId(res);
    } catch (e) {
      console.error('Error while creating new feedback');
    }
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

  const retryFeedbackSubmission = async (newFeedback) => {
    try {
      const newUser = await reassignCurrentUser();
      newFeedback.user.stitch_id = newUser.id;
      await upsertFeedback(newFeedback);
      setFeedback(newFeedback);
    } catch (e) {
      console.error('Error when retrying feedback submission', e);
    }
  };

  const submitAllFeedback = async ({ comment = '', email = '', dataUri, viewport }) => {
    // Route the user to their "next steps"
    setProgress([false, false, true]);
    setView('submitted');

    if (!selectedRating) return;
    // Submit the full feedback document
    const newFeedback = createFeedbackPayload(selectedRating, email, dataUri, viewport, comment);
    try {
      await upsertFeedback(newFeedback);
    } catch (err) {
      // This catch block will most likely only be hit after Realm attempts internal retry logic
      // after access token is refreshed
      console.error('There was an error submitting feedback', err);
      if (err.statusCode === 401) {
        // Explicitly retry 1 time to avoid any infinite loop
        await retryFeedbackSubmission(newFeedback);
      }
    } finally {
      setFeedback();
      setFeedbackId();
    }
  };

  // Stop giving feedback (if in progress) and reset the widget to the
  // initial state.
  const abandon = useCallback(() => {
    document.getElementById(STYLED_RIGHT_COLUMN).style.position = 'sticky';
    setView('waiting');
    setFeedback();
    setSelectedRating();
    setFeedbackId();
    setIsScreenshotButtonClicked(false);
  }, []);

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
    selectedRating,
    setSelectedRating,
    selectInitialRating,
    isScreenshotButtonClicked,
    setIsScreenshotButtonClicked,
  };

  // reset feedback when route changes
  useEffect(() => {
    // disable effect for testing views
    if (test?.view) return;
    abandon();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [href]);

  return <FeedbackContext.Provider value={value}>{props.children}</FeedbackContext.Provider>;
}

export const useFeedbackContext = () => {
  const feedback = useContext(FeedbackContext);
  if (!feedback && feedback !== null) {
    throw new Error('You must nest useFeedbackContext() inside of a FeedbackProvider.');
  }
  return feedback;
};
