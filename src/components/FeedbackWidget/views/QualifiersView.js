import React from 'react';
import styled from '@emotion/styled';
import { useFeedbackState } from '../context';

import Checkbox from '@leafygreen-ui/checkbox';
import Button from '@leafygreen-ui/button';

import { Layout, RatingHeader, Footer } from '../components/view-components';

const sortQualifiers = qualifiers => qualifiers.sort((q1, q2) => (q1.displayOrder > q2.displayOrder ? 1 : -1));

export default function QualifierView({ ...props }) {
  const { feedback, submitQualifiers } = useFeedbackState();
  const { rating } = feedback || { rating: 3 };
  const isPositiveRating = rating > 3;

  return (
    <Layout>
      <RatingHeader isPositive={isPositiveRating} />
      <Qualifiers>
        {sortQualifiers(feedback.qualifiers).map(({ id, text }) => (
          <Qualifier key={id} id={id} text={text} />
        ))}
      </Qualifiers>
      <Footer>
        <Button onClick={() => submitQualifiers()}>Continue</Button>
      </Footer>
    </Layout>
  );
}
const Spacer = styled.div``;
const Qualifiers = styled.div`
  display: flex;
  flex-direction: column;
  text-align: left;
`;
const QualifierLayout = styled.div`
  padding: 10px 0;
`;
function Qualifier({ id, text = '' }) {
  const { setQualifier } = useFeedbackState();
  if (!text) return;
  return (
    <QualifierLayout>
      <Checkbox onChange={event => setQualifier(id, event.target.checked)} label={text} bold={false} />
    </QualifierLayout>
  );
}
