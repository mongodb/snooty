import React from 'react';
import StarRating, { StarRatingLabel } from './components/StarRating';
import { useFeedbackContext } from './context';

const FeedbackHeading = ({ isVisible = true }) => {
  const { hideHeader } = useFeedbackContext();
  return (
    isVisible &&
    !hideHeader && (
      <>
        <StarRating size="lg" />
        <StarRatingLabel>Share Feedback</StarRatingLabel>
      </>
    )
  );
};

export default FeedbackHeading;
