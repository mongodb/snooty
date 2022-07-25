import React from 'react';
import Loadable from '@loadable/component';
import useScreenSize from '../../../hooks/useScreenSize';
import { useFeedbackState } from './context';
import FeedbackFullScreen from './FeedbackFullScreen';
import FloatingContainer from './FloatingContainer';
import FeedbackModal from './FeedbackModal';
import SentimentView from './views/SentimentView';
import RatingView from './views/RatingView';
import QualifiersView from './views/QualifiersView';
import SupportView from './views/SupportView';
import SubmittedView from './views/SubmittedView';
const CommentView = Loadable(() => import('../FeedbackWidget/views/CommentView'));

export function FeedbackContent({ view }) {
  const View = {
    sentiment: SentimentView,
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
    floating: FloatingContainer,
    // If small screen, render a card in a modal
    modal: FeedbackModal,
    // If mini screen, render a full screen app
    fullscreen: FeedbackFullScreen,
  }[displayAs];

  return (
    isOpen && (
      <div className={fwFormId} hidden={!isOpen}>
        <Container isOpen={isOpen}>
          <FeedbackContent view={view} />
        </Container>
      </div>
    )
  );
}

export const feedbackId = 'feedback-card';
export const fwFormId = 'feedback-form';
