import React from 'react';
import { css, cx } from '@leafygreen-ui/emotion';
import Loadable from '@loadable/component';
import { createPortal } from 'react-dom';
import useScreenSize from '../../../hooks/useScreenSize';
import { theme } from '../../../theme/docsTheme';
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
  position: absolute;
  right: 0;
  margin-top: ${theme.size.tiny};

  @media ${theme.screenSize.upToSmall} {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    overflow-y: auto;
  }
`;

export const feedbackId = 'feedback-card';
export const fwFormId = 'feedback-form';

const FeedbackForm = () => {
  const { view } = useFeedbackContext();
  const { isMobile } = useScreenSize();
  const isOpen = view !== 'waiting';

  const renderedComponent = isOpen && (
    <div className={cx(fwFormId, formStyle)} id={feedbackId} hidden={!isOpen}>
      <FeedbackCard isOpen={isOpen}>
        <FeedbackContent view={view} />
      </FeedbackCard>
    </div>
  );

  return isMobile ? createPortal(renderedComponent, document.body) : renderedComponent;
};

export default FeedbackForm;
