import React from 'react';
import styled from '@emotion/styled';
import StarRating from './components/StarRating';
import { css } from '@emotion/core';

export default function FeedbackHeading({ isVisible, isStacked }) {
  return (
    isVisible && (
      <StarRatingContainer isStacked={isStacked}>
        <StarRating size="lg" />
        <FeedbackText>Give Feedback</FeedbackText>
      </StarRatingContainer>
    )
  );
}

const StarRatingContainer = styled.div(
  ({ isStacked }) => css`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: ${isStacked ? 'flex-start' : 'center'};
  `
);
const FeedbackText = styled.div``;
