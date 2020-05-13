import React from 'react';
import { Layout, Heading } from '../components/view-components';
import StarRating from '../components/StarRating';

export default function RatingView(props) {
  return (
    <Layout>
      <Heading>How helpful was this page?</Heading>
      <StarRating size="2x" />
    </Layout>
  );
}
