import React, { useState, useContext, createContext } from 'react';
import {
  createNewFeedback,
  updateFeedback,
  submitFeedback,
  abandonFeedback,
  useStitchUser,
  addAttachment,
} from './stitch';
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
    /**{
      page: {
        title: page.title,
        slug: page.slug,
        url: page.url,
        docs_property: page.docs_property,
        docs_version: null,
      },
      user: {
        stitch_id: user && user.id,
        segment_id: segment.id,
        isAnonymous: segment.isAnonymous,
      },
      viewport: getViewport(),
      ...test.feedback,
    };
    const { _id } = await createNewFeedback(newFeedback);**/
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

  // Sets the user's star rating for the page
  async function setRating(ratingValue) {
    // Once a user has set a rating, they cannot change it unless they
    // abandon or submit the current feedback.
    if (feedback && feedback.rating) return;
    // Users on small screens start giving feedback by clicking a star
    // rating instead of the feedback tab. In this case, we need to
    // initialize a new feedback document before we set the rating.
    const feedback_id = feedback ? feedback._id : (await initializeFeedback('waiting'))._id;
    // The star rating must be in range [1-5]
    if (typeof ratingValue !== 'number') {
      throw new Error('Rating value must be a number.');
    }
    if (ratingValue < 1 || ratingValue > 5) {
      throw new Error('Rating value must be between 1 and 5, inclusive.');
    }
    // Update the feedback with the selected rating and then show the
    // user the relevant qualifier checkboxes. The qualifiers depend on
    // the rating so we need to await them from the server.
    const updatedFeedback = await updateFeedback({
      feedback_id: feedback ? feedback._id : feedback_id,
      rating: ratingValue,
    });
    setFeedback(updatedFeedback);
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

  // Submit the feedback and direct the user to the most appropriate "next steps" screen.
  /** async function submitComment({ comment = '', email = '' }) {
    if (!selectedSentiment) return;
    // Update the document with the user's comment and email (if provided)
    const updatedFeedback = await updateFeedback({
      feedback_id: feedback._id,
      comment,
      user: { email },
    });
    setFeedback(updatedFeedback);
  }
  */

  async function submitAllFeedback({ comment = '', email = '' }) {
    setView('submitted');
    setProgress([true, true, true]);
    if (!selectedSentiment) return;
    // Submit the full feedback document
    const segment = getSegmentUserId();
    const newFeedback = {
      page: {
        title: page.title,
        slug: page.slug,
        url: page.url,
        docs_property: page.docs_property,
        docs_version: null,
      },
      user: {
        segment_id: segment.id,
        isAnonymous: segment.isAnonymous,
        stitch_id: user && user.id,
        email: email,
      },
      viewport: getViewport(),
      comment: comment,
      category: selectedSentiment,
      ...test.feedback,
    };
    createNewFeedback(newFeedback);
    setFeedback(newFeedback);
    // Route the user to their "next steps"
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
