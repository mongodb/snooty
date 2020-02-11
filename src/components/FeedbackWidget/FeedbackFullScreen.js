import React from 'react';
import styled from '@emotion/styled';
import { uiColors } from '@leafygreen-ui/palette';

import useNoScroll from './hooks/useNoScroll';

import { useFeedbackState } from './context';
import CloseButton from './components/CloseButton';
import StarRating, { RATING_TOOLTIPS, StarRatingLabel } from './components/StarRating';

export default function FeedbackFullScreen({ isOpen, children }) {
  const { feedback, abandon } = useFeedbackState();
  useNoScroll(isOpen);
  return (
    isOpen && (
      <FullScreen>
        <Header>
          <HeaderControls>
            <CloseButton size="xlarge" onClick={abandon} />
          </HeaderControls>
          {feedback && feedback.rating && (
            <HeaderContent>
              <StarRating size="lg" />
              <StarRatingLabel>{`${RATING_TOOLTIPS[feedback.rating]} helpful`}</StarRatingLabel>
            </HeaderContent>
          )}
        </Header>
        <Content>{children}</Content>
      </FullScreen>
    )
  );
}

const FullScreen = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: white;
  padding-top: 45px;
  z-index: 1;
`;
const Header = styled.div`
  display: flex;
  flex-direction: column;
  padding: 8px;
  background: ${uiColors.gray.light3};
  margin-bottom: 20px;
`;
const HeaderControls = styled.div`
  display: flex;
  justify-content: flex-end;
  padding: 4px;
`;
const HeaderContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: left;
  padding: 16px;
  margin: 20px 0 0 0;
`;
const Content = styled.div`
  display: flex;
  flex-direction: column;
  width: 300px;
  margin: 0 auto;
  padding: 0 24px;
`;
