import { FeedbackProvider, useFeedbackContext } from './context';
import useFeedbackData from './useFeedbackData';
import FeedbackForm from './FeedbackForm';
import FeedbackButton from './FeedbackButton';
import FeedbackContainer from './FeedbackContainer';

const FeedbackRating = ({ slug, className, classNameContainer }) => {
  const url = isBrowser ? window.location.href : null;
  const metadata = useSnootyMetadata();
  const feedbackData = useFeedbackData({
    slug,
    url,
    title:
      getPlaintext(getNestedValue(['slugToTitle', slug === '/' ? 'index' : slug], metadata)) || 'MongoDB Documentation',
  });

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
