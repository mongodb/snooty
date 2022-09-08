import React, { useContext } from 'react';
import styled from '@emotion/styled';
import { palette } from '@leafygreen-ui/palette';
import useNoScroll from './hooks/useNoScroll';
import { useFeedbackContext } from './context';
import CloseButton from './components/CloseButton';
import StarRating, { RATING_TOOLTIPS, StarRatingLabel } from './components/StarRating';
import { HeaderContext } from '../../Header/header-context';

const FullScreen = styled.div(
  (props) => `
    background: white;
    height: 100vh;
    left: 0;
    overflow-y: scroll;
    padding-top: ${props.totalHeaderHeight};
    position: fixed;
    top: 0;
    width: 100vw;
    z-index: 1;
  `
);

const Header = styled.div`
  display: flex;
  flex-direction: column;
  padding: 8px;
  background: ${palette.gray.light3};
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
  width: 380px;
  margin: 0 auto;
  padding: 0 24px;
`;

const FeedbackFullScreen = ({ isOpen, children }) => {
  const { feedback, abandon } = useFeedbackContext();
  const { totalHeaderHeight } = useContext(HeaderContext);
  useNoScroll(isOpen);
  return (
    isOpen && (
      <FullScreen totalHeaderHeight={totalHeaderHeight}>
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
};

export default FeedbackFullScreen;
