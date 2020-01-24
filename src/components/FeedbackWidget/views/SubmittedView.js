import React from 'react';
import styled from '@emotion/styled';

export default function SubmittedView(props) {
  return (
    <Layout>
      <Heading>We appreciate your feedback.</Heading>
      <Subheading>We're working hard to improve MongoDB Documentation.</Subheading>
      <Subheading>For additional support, explore the MongoDB discussion forum.</Subheading>
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
const Subheading = styled.p`
  margin-top: 0;
  width: 100%;
  text-align: left;
  font-weight: normal;
`;
