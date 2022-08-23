import React from 'react';
import { css } from '@emotion/react';
import Loadable from '@loadable/component';
import useScreenSize from '../../../hooks/useScreenSize';
import { useFeedbackState } from './context';
import FeedbackFullScreen from './FeedbackFullScreen';
import FeedbackCard from './FeedbackCard';
import FeedbackModal from './FeedbackModal';
import RatingView from './views/RatingView';
import QualifiersView from './views/QualifiersView';
import SupportView from './views/SupportView';
import SubmittedView from './views/SubmittedView';
const CommentView = Loadable(() => import('../FeedbackWidget/views/CommentView'));

const feedbackStyle = css`
  z-index: 20;
`;

export function FeedbackContent({ view }) {
  const View = {
    rating: RatingView,
    qualifiers: QualifiersView,
    comment: CommentView,
    support: SupportView,
    submitted: SubmittedView,
  }[view];
  return <View className={`view-${view}`} />;
}

export default function FeedbackForm(props) {
  const { isMobile, isTabletOrMobile } = useScreenSize();
  const { view } = useFeedbackState();
  const isOpen = view !== 'waiting';

  const displayAs = isMobile ? 'fullscreen' : isTabletOrMobile ? 'modal' : 'floating';
  const Container = {
    // If big screen, render a floating card
    floating: FeedbackCard,
    // If small screen, render a card in a modal
    modal: FeedbackModal,
    // If mini screen, render a full screen app
    fullscreen: FeedbackFullScreen,
  }[displayAs];

  return (
    isOpen && (
      <div className="feedback-form" hidden={!isOpen} css={feedbackStyle}>
        <Container isOpen={isOpen}>
          <FeedbackContent view={view} />
        </Container>
      </div>
    )
  );
}
