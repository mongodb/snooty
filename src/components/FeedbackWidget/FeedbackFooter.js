import React from 'react';
import styled from '@emotion/styled';
import usePageSize from '../../hooks/usePageSize';
import StarRating from './components/StarRating';

export default function FeedbackFooter() {
  const { isTabletOrMobile } = usePageSize();
  return (
    isTabletOrMobile && (
      <Container>
        <StarRatingContainer>
          Was this page helpful?
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
  width: 420px;
  max-height: 80px;
`;
