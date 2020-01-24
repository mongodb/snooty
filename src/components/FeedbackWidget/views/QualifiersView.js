import React from 'react';
import styled from '@emotion/styled';
import { useFeedbackState } from '../context';

import Checkbox from '@leafygreen-ui/checkbox';
import Button from '@leafygreen-ui/button';

const NEGATIVE_RATING_HEADING = "We're sorry to hear that.";
const POSITIVE_RATING_HEADING = "We're glad to hear that!";

export default function QualifierView({ ...props }) {
  const { feedback, submitQualifiers } = useFeedbackState();
  const { rating } = feedback || { rating: 3 };
  const isPositiveRating = rating > 3;

  return (
    <Layout>
      <Heading>{isPositiveRating ? POSITIVE_RATING_HEADING : NEGATIVE_RATING_HEADING}</Heading>
      <Subheading>Please describe your experience with the MongoDB Documentation.</Subheading>
      <Qualifiers>
        {feedback.qualifiers
          .sort((q1, q2) => (q1.displayOrder < q2.displayOrder ? -1 : 1))
          .map(qualifier => {
            const { id, text } = qualifier;
            return <Qualifier key={id} id={id} text={text} />;
          })}
      </Qualifiers>
      <Footer>
        <Button onClick={() => submitQualifiers()}>Continue</Button>
      </Footer>
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
const Footer = styled.div`
  margin-top: 0;
  width: 100%;
  text-align: right;
  font-weight: normal;
`;
const Subheading = styled.p`
  margin-top: 0;
  width: 100%;
  text-align: left;
  font-weight: normal;
`;
const Qualifiers = styled.div`
  display: flex;
  flex-direction: column;
  /* align-items: center; */
  text-align: left;
`;
function Qualifier({ id, text = '' }) {
  const { setQualifier } = useFeedbackState();
  if (!text) return;
  return (
    <QualifierContainer>
      <QualifierCheckbox
        className="my-checkbox"
        onChange={event => {
          /* Something to handle the click event */
          setQualifier(id, event.target.checked);
        }}
        label={text}
        // checked={true}
        bold={false}
      />
    </QualifierContainer>
  );
}
const QualifierCheckbox = styled(Checkbox)``;
const QualifierContainer = styled.span`
  padding: 8px 0;
`;
