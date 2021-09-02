import React from 'react';

import useScreenSize from '../../../hooks/useScreenSize';
import { useFeedbackState } from './context';

import FeedbackFullScreen from './FeedbackFullScreen';
import FeedbackCard from './FeedbackCard';
import FeedbackModal from './FeedbackModal';

import RatingView from './views/RatingView';
import QualifiersView from './views/QualifiersView';
import SupportView from './views/SupportView';
import SubmittedView from './views/SubmittedView';
import CommentView from './views/CommentView';

const getView = (view) => {
  switch (view) {
    case 'rating':
      return RatingView;
    case 'qualifiers':
      return QualifiersView;
    case 'comment':
      return CommentView;
    case 'support':
      return SupportView;
    case 'submitted':
      return SubmittedView;
    default:
      return RatingView;
  }
};

const FeedbackForm = (props) => {
  const { isMobile, isTabletOrMobile } = useScreenSize();
  const { view } = useFeedbackState();
  const isOpen = view !== 'waiting';

  const Container = isMobile ? FeedbackFullScreen : isTabletOrMobile ? FeedbackModal : FeedbackCard;
  const View = getView(view);

  return (
    isOpen && (
      <div className="feedback-form" hidden={!isOpen}>
        <Container isOpen={isOpen}>
          <View className={`view-${view}`} />
        </Container>
      </div>
    )
  );
};

export default FeedbackForm;
