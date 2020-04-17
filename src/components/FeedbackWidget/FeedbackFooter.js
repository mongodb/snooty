import React from 'react';
import styled from '@emotion/styled';
import useScreenSize from '../../hooks/useScreenSize';
import StarRating from './components/StarRating';

export default function FeedbackFooter() {
  const { isTabletOrMobile } = useScreenSize();
  return (
    isTabletOrMobile && (
      <Container>
        <StarRatingContainer>
          How helpful was this page?
          <StarRating size="2x" />
        </StarRatingContainer>
      </Container>
    )
  );
}

const Container = styled.div`
  display: flex;
  position: relative;
  justify-content: center;
  align-items: center;
`;
const StarRatingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 220px;
  max-height: 80px;
`;
