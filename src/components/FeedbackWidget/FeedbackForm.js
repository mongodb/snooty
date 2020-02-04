import React from 'react';

import RatingView from './views/RatingView';
import CommentView from './views/CommentView';
import QualifiersView from './views/QualifiersView';
import SupportView from './views/SupportView';
import SubmittedView from './views/SubmittedView';

import FeedbackFullScreen from './FeedbackFullScreen';
import FeedbackCard from './FeedbackCard';
import FeedbackModal from './FeedbackModal';

import usePageSize from '../../hooks/usePageSize';
import { useFeedbackState } from './context';

export function FeedbackContent(props) {
  const { view } = useFeedbackState();
  const View = {
    rating: RatingView,
    qualifiers: QualifiersView,
    comment: CommentView,
    support: SupportView,
    submitted: SubmittedView,
  }[view];
  return <View />;
}

export default function FeedbackForm(props) {
  const { isTabletOrMobile, isSmallScreen } = usePageSize();
  const { view } = useFeedbackState();
  const isOpen = view !== 'waiting';

  const displayAs = isSmallScreen ? 'fullscreen' : isTabletOrMobile ? 'modal' : 'floating';
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
      <div className="feedback-form" hidden={!isOpen}>
        <Container isOpen={isOpen}>
          <FeedbackContent />
        </Container>
      </div>
    )
  );
}
