import React from 'react';
import styled from '@emotion/styled';
import StarRating from '../components/StarRating';

export default function RatingView(props) {
  return (
    <Layout>
      <Heading>Was this page helpful?</Heading>
      <StarRating size="3x" />
    </Layout>
  );
}
const Layout = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;
const Heading = styled.h2`
  margin-top: 0;
  width: 100%;
  text-align: left;
  font-weight: normal;
`;
