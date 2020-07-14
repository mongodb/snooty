import React from 'react';
import styled from '@emotion/styled';
import { css } from '@emotion/core';
import StarRating, { StarRatingLabel } from './components/StarRating';
import { useFeedbackState } from './context';

export default function FeedbackHeading({ isVisible = true, isStacked = false }) {
  const { hideHeader } = useFeedbackState();
  return (
    isVisible &&
    !hideHeader && (
      <StarRatingContainer isStacked={isStacked}>
        <StarRating size="lg" />
        <StarRatingLabel>Give Feedback</StarRatingLabel>
      </StarRatingContainer>
    )
  );
}

const StarRatingContainer = styled.div(
  ({ isStacked }) => css`
    margin-top: 4px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: ${isStacked ? 'flex-start' : 'center'};
  `
);
