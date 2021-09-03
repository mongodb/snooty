import React from 'react';
import { css } from '@emotion/core';
import StarRating, { StarRatingLabel } from './components/StarRating';
import { useFeedbackState } from './context';

// Prevent CLS caused by late loading of rating stars
const WrappedStarRating = ({ size }) => (
  <div
    css={css`
      height: 24px;
    `}
  >
    <StarRating size={size} />
  </div>
);

export default function FeedbackHeading({ isVisible = true }) {
  const { hideHeader } = useFeedbackState();
  return (
    isVisible &&
    !hideHeader && (
      <>
        <WrappedStarRating size={'lg'} />
        <StarRatingLabel>Give Feedback</StarRatingLabel>
      </>
    )
  );
}
