import React from 'react';
import { css, cx } from '@leafygreen-ui/emotion';
import Loadable from '@loadable/component';
import { createPortal } from 'react-dom';
import useScreenSize from '../../../hooks/useScreenSize';
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

const formStyle = css`
  position: relative;
`;

const FeedbackForm = () => {
  const { view } = useFeedbackContext();
  const { isMobile } = useScreenSize();
  const isOpen = view !== 'waiting';

  const renderedComponent = isOpen && (
    <div className={cx(fwFormId, formStyle)} hidden={!isOpen}>
      <FeedbackCard isOpen={isOpen}>
        <FeedbackContent view={view} />
      </FeedbackCard>
    </div>
  );

  return isMobile ? createPortal(renderedComponent, document.body) : renderedComponent;
};

export const feedbackId = 'feedback-card';
export const fwFormId = 'feedback-form';

export default FeedbackForm;
