import React from 'react';
import styled from '@emotion/styled';

const NEGATIVE_RATING_HEADING = "We're sorry to hear that.";
const NEGATIVE_RATING_SUBHEADING = 'What seems to be the issue?';
const POSITIVE_RATING_HEADING = "We're glad to hear that!";
const POSITIVE_RATING_SUBHEADING = 'Tell us more.';
export const RatingHeader = ({ isPositive, noSubheading = false }) => {
  return (
    <>
      <Heading>{isPositive ? POSITIVE_RATING_HEADING : NEGATIVE_RATING_HEADING}</Heading>
      {!noSubheading && <Subheading>{isPositive ? POSITIVE_RATING_SUBHEADING : NEGATIVE_RATING_SUBHEADING}</Subheading>}
    </>
  );
};

export const Layout = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const Heading = styled.h2`
  margin-top: 0;
  margin-bottom: 16px;
  width: 100%;
  text-align: left;
  font-weight: normal;
  font-size: 1.85em;
`;

export const Subheading = styled.h3`
  margin-top: 0;
  margin-bottom: 16px;
  width: 100%;
  text-align: left;
  font-weight: normal;
  font-size: 1.25em;
`;

export const Footer = styled.div`
  margin-top: 0;
  width: 100%;
  font-weight: normal;
  display: flex;
  flex-direction: row-reverse;
  justify-content: space-between;
`;
