import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import ComponentFactory from './ComponentFactory';
import Button from '@leafygreen-ui/button';
import Card from '@leafygreen-ui/card';
import { uiColors } from '@leafygreen-ui/palette';
import EllipsisIcon from '@leafygreen-ui/icon/dist/Ellipsis';
import IconButton from '@leafygreen-ui/icon-button';
import Icon from '@leafygreen-ui/icon';
import QuizChoice from './QuizChoice';

const StyledCard = styled(Card)`
  background-color: ${uiColors.gray.light3};
  width: 100%;
  height: 573px;
  padding: 40px;
`;

const QuizTitle = styled('p')`
  margin: 0 0 32px 0 !important;
  font-family: Akzidenz;
  font-weight: 500;
  font-style: normal;
  font-size: 21px;
`;

const QuizHeader = styled('div')`
  text-align: center;
`;

const QuizSubtitle = styled('p')`
  font-family: Akzidenz;
  font-weight: 500;
  font-style: normal;
  font-size: 14px;
  line-height: 16.59px;
  color: ${uiColors.gray.base};
  margin: 0 !important;
`;

const QuizQuestion = styled('p')`
  font-family: Akzidenz;
  font-weight: 400;
  font-size: 16px;
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
  const [question, ...choices] = children;
  return (
    <StyledCard>
      <QuizCompleteHeader />
      <QuizCompleteSubtitle question={question.children} />
      {choices.map((node, i) => (
        <ComponentFactory nodeData={node} key={i} />
      ))}
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
