import React from 'react';
import StarRating, { StarRatingLabel } from './components/StarRating';
import { useFeedbackState } from './context';

export default function FeedbackHeading() {
  const { hideHeader } = useFeedbackState();
  return (
    !hideHeader && (
      <>
        <StarRating size={'lg'} />
        <StarRatingLabel>Give Feedback</StarRatingLabel>
      </>
    )
  );
}
