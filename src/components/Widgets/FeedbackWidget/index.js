import { isBrowser } from '../../../utils/is-browser';
import { getPlaintext } from '../../../utils/get-plaintext';
import { getNestedValue } from '../../../utils/get-nested-value';
import { RatingView } from '../../Widgets/FeedbackWidget/views';
import useSnootyMetadata from '../../../utils/use-snooty-metadata';
import FeedbackContainer from './FeedbackContainer';
import FeedbackForm from './FeedbackForm';
import useFeedbackData from './useFeedbackData';
import { FeedbackProvider, useFeedbackContext } from './context';

const NewFeedbackWidget = ({ slug, className }) => {
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
      <FeedbackContainer>
        <FeedbackForm className={className} />
        <RatingView />
      </FeedbackContainer>
    </FeedbackProvider>
  );
};

export default NewFeedbackWidget;

export { FeedbackProvider, useFeedbackContext, useFeedbackData, FeedbackForm, FeedbackContainer };
