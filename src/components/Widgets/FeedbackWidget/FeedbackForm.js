import React from 'react';
import Loadable from '@loadable/component';
import { useFeedbackContext } from './context';
import FeedbackCard from './FeedbackCard';
import RatingView from './views/RatingView';
import SubmittedView from './views/SubmittedView';
const CommentView = Loadable(() => import('../FeedbackWidget/views/CommentView'));

export const FeedbackContent = ({ view }) => {
  const View = {
    rating: RatingView,
    comment: CommentView,
    submitted: SubmittedView,
  }[view];
  return <View className={`view-${view}`} />;
};

const FeedbackForm = () => {
  const { view } = useFeedbackContext();
  const isOpen = view !== 'waiting';

  return (
    isOpen && (
      <div className={fwFormId} hidden={!isOpen}>
        <FeedbackCard isOpen={isOpen}>
          <FeedbackContent view={view} />
        </FeedbackCard>
      </div>
    )
  );
};

export const feedbackId = 'feedback-card';
export const fwFormId = 'feedback-form';

export default FeedbackForm;
