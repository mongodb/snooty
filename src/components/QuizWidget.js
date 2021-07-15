import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import Button from '@leafygreen-ui/button';
import Card from '@leafygreen-ui/card';
import { uiColors } from '@leafygreen-ui/palette';
import Icon from '@leafygreen-ui/icon';
import ComponentFactory from './ComponentFactory';

const StyledCard = styled(Card)`
  background-color: ${uiColors.gray.light3};
  width: 100%;
  padding: 40px;
`;

const QuizTitle = styled('p')`
  margin: 0 0 32px 0 !important;
  font-weight: 500;
  font-size: 18px;
`;

const QuizHeader = styled('div')`
  text-align: center;
`;

const QuizSubtitle = styled('p')`
  font-weight: 500;
  font-size: 14px;
  line-height: 16.59px;
  color: ${uiColors.gray.base};
  margin: 0 !important;
`;

const QuizQuestion = styled('p')`
  margin: 8px 0 24px 0 !important;
`;

const StyledButton = styled(Button)`
  font-size: 16px;
`;

const QuizCompleteHeader = () => {
  return (
    <QuizHeader>
      <Icon glyph="CheckmarkWithCircle" fill={uiColors.green.base} size="large" />
      <QuizTitle>Check your understanding</QuizTitle>
    </QuizHeader>
  );
};

const QuizCompleteSubtitle = ({ question }) => {
  return (
    <>
      <QuizSubtitle>Question</QuizSubtitle>
      <QuizQuestion>
        {question.map((node, i) => (
          <ComponentFactory nodeData={node} key={i} />
        ))}
      </QuizQuestion>
    </>
  );
};

const QuizWidget = ({ nodeData: { children } }) => {
  return (
    <StyledCard>
      <QuizCompleteHeader />
      <QuizCompleteSubtitle question={children[0].children} />
      <StyledButton variant="default">Submit</StyledButton>
    </StyledCard>
  );
};

QuizWidget.propTypes = {
  nodeData: PropTypes.shape({
    children: PropTypes.arrayOf(PropTypes.object).isRequired,
  }).isRequired,
};

export default QuizWidget;
