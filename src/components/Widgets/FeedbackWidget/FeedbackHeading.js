import React from 'react';
import styled from '@emotion/styled';
import { css } from '@emotion/core';
import StarRating, { StarRatingLabel } from './components/StarRating';
import { useFeedbackState } from './context';

export default function FeedbackHeading({ isVisible = true }) {
  const { hideHeader } = useFeedbackState();
  return (
    isVisible &&
    !hideHeader && (
      <>
        <StarRating size="lg" />
        <StarRatingLabel>Give Feedback</StarRatingLabel>
      </>
    )
  );
}
