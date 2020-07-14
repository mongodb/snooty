import React from 'react';
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

const FeedbackContext = React.createContext();

export function FeedbackProvider({ page, hideHeader, test = {}, ...props }) {
  const [feedback, setFeedback] = React.useState((test.feedback !== {} && test.feedback) || null);
  const [isSupportRequest, setIsSupportRequest] = React.useState(test.isSupportRequest || false);
  const [view, setView] = React.useState(test.view || 'waiting');
  const user = useStitchUser();

  // Create a new feedback document
  async function initializeFeedback(nextView = 'rating') {
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
        stitch_id: user && user.id,
        segment_id: segment.id,
        isAnonymous: segment.isAnonymous,
      },
      viewport: getViewport(),
      ...test.feedback,
    };
    const { _id } = await createNewFeedback(newFeedback);
    setFeedback({ _id, ...newFeedback });
    setView(nextView);
    return newFeedback;
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
    setView('qualifiers');
  }

  // Sets the value of a single qualifier checkbox
  async function setQualifier(id, value) {
    if (!feedback) return;
    if (typeof id !== 'string') {
      throw new Error('id must be a string Qualifier ID.');
    }
    if (typeof value !== 'boolean') {
      throw new Error('value must be a boolean.');
    }
    const updatedFeedback = await updateFeedback({
      feedback_id: feedback._id,
      qualifiers: updateQualifier(feedback.qualifiers, id, value),
    });
    setFeedback(updatedFeedback);
  }

  // Once a user has selected qualifiers, show them the comment/email input boxes.
  function submitQualifiers() {
    if (!feedback) return;
    // The widget flow changes if the user selected the "need support" qualifier
    const selectedSupportQualifier = feedback.qualifiers.find(q => q.id === 'support' && q.value === true);
    setIsSupportRequest(Boolean(selectedSupportQualifier));
    setView('comment');
  }

  // Upload a screenshot to S3 and attach it to the feedback
  async function submitScreenshot({ dataUri, viewport }) {
    if (!feedback) return;
    const updatedFeedback = await addAttachment({
      feedback_id: feedback._id,
      attachment: { type: 'screenshot', dataUri, viewport },
    });
    setFeedback(updatedFeedback);
  }

  // Submit the feedback and direct the user to the most appropriate "next steps" screen.
  async function submitComment({ comment = '', email = '' }) {
    if (!feedback) return;
    // Update the document with the user's comment and email (if provided)
    const updatedFeedback = await updateFeedback({
      feedback_id: feedback._id,
      comment,
      user: { email },
    });
    setFeedback(updatedFeedback);
  }

  async function submitAllFeedback() {
    // Submit the full feedback document
    const submittedFeedback = await submitFeedback({ feedback_id: feedback._id });
    setFeedback(submittedFeedback);
    // Route the user to their "next steps"
    if (isSupportRequest) {
      setView('support');
    } else {
      setView('submitted');
    }
  }

  // Show the user a thank you screen after they've seen support links
  async function submitSupport() {
    if (!feedback) return;
    setView('submitted');
  }

  // Stop giving feedback (if in progress) and reset the widget to the
  // initial state.
  async function abandon() {
    // Reset to the initial state
    setView('waiting');
    if (feedback) {
      // We hold on to abandoned feedback in the database, so wait until
      // we've marked the document as abandoned
      await abandonFeedback({ feedback_id: feedback._id });
      setFeedback(null);
    }
  }

  const value = {
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
    submitAllFeedback,
    abandon,
    hideHeader,
  };

  return <FeedbackContext.Provider value={value}>{props.children}</FeedbackContext.Provider>;
}

function updateQualifier(qualifiers, id, value) {
  const index = qualifiers.findIndex(q => q.id === id);
  return [...qualifiers.slice(0, index), { ...qualifiers[index], value }, ...qualifiers.slice(index + 1)];
}

export function useFeedbackState() {
  const feedback = React.useContext(FeedbackContext);
  if (!feedback && feedback !== null) {
    throw new Error('You must nest useFeedbackState() inside of a FeedbackProvider.');
  }
  return feedback;
}
