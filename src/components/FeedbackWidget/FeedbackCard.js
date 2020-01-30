import React from 'react';
import LeafygreenCard from '@leafygreen-ui/card';
import styled from '@emotion/styled';

import Icon from '@leafygreen-ui/icon';
import IconButton from '@leafygreen-ui/icon-button';
import Modal from '@leafygreen-ui/modal';
import { uiColors } from '@leafygreen-ui/palette';

import RatingView from './views/RatingView';
import CommentView from './views/CommentView';
import QualifiersView from './views/QualifiersView';
import SupportView from './views/SupportView';
import SubmittedView from './views/SubmittedView';

import StarRating, { RATING_TOOLTIPS, StarRatingLabel } from './components/StarRating';

import { useFeedbackState } from './context';
import usePageSize from '../../hooks/usePageSize';
import noScroll from 'no-scroll';

function FeedbackContent(props) {
  const { view } = useFeedbackState();
  return (
    <Content>
      {view === 'rating' && <RatingView />}
      {view === 'qualifiers' && <QualifiersView />}
      {view === 'comment' && <CommentView />}
      {view === 'support' && <SupportView />}
      {view === 'submitted' && <SubmittedView />}
    </Content>
  );
}

export function FeedbackForm({ ...props }) {
  const { view, abandon } = useFeedbackState();
  const isOpen = view !== 'waiting';
  const { isTabletOrMobile, isSmallScreen } = usePageSize();
  const displayAs = isSmallScreen ? 'fullscreen' : isTabletOrMobile ? 'modal' : 'floating';

  return (
    <div className="feedback-form" hidden={!isOpen}>
      {{
        // If big screen, render a floating card
        floating: () => <FeedbackCard className="feedback-form" isOpen={isOpen} />,
        // If small screen, render a card in a modal
        modal: () => (
          <FeedbackModal
            size="small"
            open={isOpen}
            shouldClose={async () => {
              await abandon();
              return true;
            }}
            className="feedback-form"
          >
            <FeedbackContent />
          </FeedbackModal>
        ),
        // If mini screen, render a full screen app
        fullscreen: () => <FeedbackFullScreen className="feedback-form" isOpen={isOpen} />,
      }[displayAs]()}
    </div>
  );
}

export default function FeedbackCard({ isOpen }) {
  const { abandon } = useFeedbackState();

  return (
    isOpen && (
      <Floating>
        <Card>
          <CardHeader>
            <CloseButton onClick={abandon} />
          </CardHeader>
          <FeedbackCardContent>
            <FeedbackContent />
          </FeedbackCardContent>
        </Card>
      </Floating>
    )
  );
}

const FeedbackCardContent = styled.div`
  padding: 0 28px 24px 28px;
`;

function useNoScroll(condition) {
  React.useEffect(() => {
    if (condition) {
      noScroll.on();
      return () => noScroll.off();
    }
  }, [condition]);
}

function FeedbackFullScreen({ isOpen }) {
  const { feedback, abandon } = useFeedbackState();
  useNoScroll(isOpen);
  return (
    isOpen && (
      <FullScreen>
        <FullScreenHeader>
          <FullScreenHeaderControls>
            <CloseButton size="xlarge" onClick={abandon} />
          </FullScreenHeaderControls>
          {feedback && (
            <FullScreenHeaderContent>
              <StarRating size="lg" />
              <StarRatingLabel>{`${RATING_TOOLTIPS[feedback.rating]} helpful`}</StarRatingLabel>
            </FullScreenHeaderContent>
          )}
        </FullScreenHeader>
        <FullScreenContent>
          <FeedbackContent />
        </FullScreenContent>
      </FullScreen>
    )
  );
}

const Floating = styled.div`
  position: fixed;
  top: 256px;
  right: 80px;
`;
const FeedbackModal = styled(Modal)`
  padding-bottom: 0;
  > div {
    padding-top: 200px;
  }
`;
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

const Card = styled(LeafygreenCard)`
  width: 420px;
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: flex-end;
  padding: 4px;
`;
const FullScreenHeader = styled.div`
  display: flex;
  flex-direction: column;
  padding: 8px;
  background: ${uiColors.gray.light3};
  margin-bottom: 20px;
`;
const FullScreenHeaderControls = styled.div`
  display: flex;
  justify-content: flex-end;
  padding: 4px;
`;
const FullScreenHeaderContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: left;
  padding: 16px;
  margin: 20px 0 0 0;
`;
const FullScreenContent = styled.div`
  display: flex;
  flex-direction: column;
  max-width: 500px;
  min-width: 375px;
  margin: 0 auto;
  padding: 0 24px;
`;

const Content = styled.div``;

const CloseButton = ({ onClick, size = 'default', ...props }) => {
  return (
    <IconButton variant="light" ariaLabel="Close Feedback Form" onClick={onClick} size={size} {...props}>
      <Icon size={size} glyph="X" />
    </IconButton>
  );
};
