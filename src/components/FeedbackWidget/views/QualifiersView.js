import React from 'react';
import styled from '@emotion/styled';
import { useFeedbackState } from '../context';

import Checkbox from '@leafygreen-ui/checkbox';
import Button from '@leafygreen-ui/button';

import { Layout, RatingHeader, Footer } from '../components/view-components';

const sortQualifiers = qualifiers => qualifiers.sort((q1, q2) => (q1.displayOrder > q2.displayOrder ? 1 : -1));

export default function QualifiersView({ ...props }) {
  const { feedback, submitQualifiers } = useFeedbackState();
  const { rating } = feedback || { rating: 3 };
  const isPositiveRating = rating > 3;

  return (
    <Layout>
      <RatingHeader isPositive={isPositiveRating} />
      <Qualifiers>
        {sortQualifiers(feedback.qualifiers).map(({ id, text, value }) => (
          <Qualifier key={id} id={id} text={text} value={value} />
        ))}
      </Qualifiers>
      <Footer>
        <Button onClick={() => submitQualifiers()}>Continue</Button>
      </Footer>
    </Layout>
  );
}

const Qualifiers = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  text-align: left;
`;
const QualifierLayout = styled.div`
  margin: 0 0 16px 0;
`;
function Qualifier({ id, text, value }) {
  const { setQualifier } = useFeedbackState();
  if (!text) return;
  return (
    <QualifierLayout onClick={() => setQualifier(id, !value)}>
      <Checkbox checked={value} label={text} bold={false} />
    </QualifierLayout>
  );
}
