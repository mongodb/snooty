import React from 'react';
import { Layout, Heading } from '../components/view-components';
import StarRating from '../components/StarRating';
import styled from '@emotion/styled';

const ViewHeader = styled('h2')`
  font-weight: 400;
  font-size: 16px;
  text-align: center;
`;

export default function SentimentView(props) {
  return (
    <Layout>
      <ViewHeader>Did this page help?</ViewHeader>
    </Layout>
  );
}