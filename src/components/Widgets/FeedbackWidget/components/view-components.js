import React from 'react';
import styled from '@emotion/styled';

const NEGATIVE_RATING_HEADING = "We're sorry to hear that.";
const NEGATIVE_RATING_SUBHEADING = 'What seems to be the issue?';
const POSITIVE_RATING_HEADING = "We're glad to hear that!";
const POSITIVE_RATING_SUBHEADING = 'Tell us more.';
export const RatingHeader = ({ isPositive, headingText, subheadingText }) => {
  const heading = headingText ? headingText : isPositive ? POSITIVE_RATING_HEADING : NEGATIVE_RATING_HEADING;
  const subheading = subheadingText
    ? subheadingText
    : isPositive
    ? POSITIVE_RATING_SUBHEADING
    : NEGATIVE_RATING_SUBHEADING;
  return (
    <>
      <Heading>{heading}</Heading>
      <Subheading>{subheading}</Subheading>
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
  font-weight: regular;
  font-size: 16px;
`;

export const Subheading = styled.p`
  margin: unset !important;
  margin-top: 8 !important;
  margin-bottom: 16px;
  width: 100%;
  text-align: left;
  font-weight: regular;
  font-size: 14px !important;
`;

export const Footer = styled.div`
  margin-top: 0;
  width: 100%;
  font-weight: normal;
  display: flex;
  flex-direction: row-reverse;
  justify-content: space-between;
  align-items: center;
`;
