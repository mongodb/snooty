import React from 'react';
import { isBrowser } from '../../../utils/is-browser';
import { getPlaintext } from '../../../utils/get-plaintext';
import { getNestedValue } from '../../../utils/get-nested-value';
import useSnootyMetadata from '../../../utils/use-snooty-metadata';
import { usePageContext } from '../../../context/page-context';
import { RatingView } from './views';
import FeedbackContainer from './FeedbackContainer';
import FeedbackForm from './FeedbackForm';
import useFeedbackData from './useFeedbackData';
import { FeedbackProvider, useFeedbackContext } from './context';

const FeedbackRating = ({
  slug,
  className,
  classNameContainer,
}: {
  slug: string;
  className: string;
  classNameContainer?: string;
}) => {
  const url = isBrowser ? window.location.href : null;
  const metadata = useSnootyMetadata();
  const feedbackData = useFeedbackData({
    slug,
    url,
    title:
      getPlaintext(getNestedValue(['slugToTitle', slug === '/' ? 'index' : slug], metadata)) || 'MongoDB Documentation',
  });
  const { options } = usePageContext();

  if (options?.hidefeedback === 'page') {
    return null;
  }

  return (
    <FeedbackProvider page={feedbackData}>
      <FeedbackContainer className={classNameContainer}>
        <FeedbackForm className={className} />
        <RatingView />
      </FeedbackContainer>
    </FeedbackProvider>
  );
};

export default FeedbackRating;

export { FeedbackProvider, useFeedbackContext, useFeedbackData, FeedbackForm, FeedbackContainer };
