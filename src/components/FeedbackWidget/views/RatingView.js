import React from 'react';
import StarRating from '../components/StarRating';
import { Layout, Heading } from '../components/view-components';

export default function RatingView(props) {
  return (
    <Layout>
      <Heading>How helpful was this page?</Heading>
      <StarRating size="3x" />
    </Layout>
  );
}
