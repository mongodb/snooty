import React from 'react';
import { Layout } from '../components/view-components';
import { useFeedbackContext } from '../context';
import ViewHeader from '../components/ViewHeader';
import StarRating from '../components/StarRating';

const RatingView = () => {
  const { selectInitialRating } = useFeedbackContext();

  return (
    <Layout>
      <ViewHeader />
      <StarRating handleRatingSelection={selectInitialRating} />
    </Layout>
  );
};

export default RatingView;
