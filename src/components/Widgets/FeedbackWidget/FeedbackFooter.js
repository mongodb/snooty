import React from 'react';
import styled from '@emotion/styled';
import useScreenSize from '../../../hooks/useScreenSize';
import StarRating from './components/StarRating';

const Container = styled.div`
  display: flex;
  position: relative;
  justify-content: center;
  align-items: center;
`;

const SentimentContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 220px;
  max-height: 80px;
`;

const FeedbackFooter = () => {
  const { isTabletOrMobile } = useScreenSize();
  return (
    isTabletOrMobile && (
      <Container>
        <SentimentContainer>
          Did this page help?
          <StarRating size="2x" />
        </SentimentContainer>
      </Container>
    )
  );
};

export default FeedbackFooter;
