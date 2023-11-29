import React from 'react';
import { Layout } from '../components/view-components';
import { useFeedbackContext } from '../context';
import ViewHeader from '../components/ViewHeader';
import StarRating from '../components/StarRating';

export const sentimentChoices = [
  { sentiment: 'Positive', copy: 'Yes, it did!', category: 'Helpful' },
  { sentiment: 'Negative', copy: 'No, I have feedback.', category: 'Unhelpful' },
  { sentiment: 'Suggestion', copy: 'I have a suggestion.', category: 'Idea' },
];

const SentimentView = () => {
  const { selectInitialRating } = useFeedbackContext();

  return (
    <Layout>
      <ViewHeader />
      <StarRating handleRatingSelection={selectInitialRating} />
    </Layout>
  );
};

export default SentimentView;
