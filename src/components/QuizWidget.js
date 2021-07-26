import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import Button from '@leafygreen-ui/button';
import Card from '@leafygreen-ui/card';
import { uiColors } from '@leafygreen-ui/palette';
import Icon from '@leafygreen-ui/icon';
import ComponentFactory from './ComponentFactory';
import { getNestedText } from '../utils/get-nested-text';
import { theme } from '../theme/docsTheme';

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
  @media ${theme.screenSize.smallAndUp} {
    text-align: center;
  }
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
      <Icon glyph="CheckmarkWithCircle" fill={uiColors.green.base} size="xlarge" />
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

const SubmitButton = ({ setHasSubmitted, selectedResponse, quizResponseObj }) => {
  return (
    <StyledButton onClick={() => selectedResponse && setHasSubmitted(true)} variant="default">
      Submit
    </StyledButton>
  );
};

const createQuizResponseObj = (questionText, quizId, project, selectedResponse) => {
  return {
    ...selectedResponse,
    questionText: questionText,
    quizId: quizId,
    project: project,
  };
};

const QuizWidget = ({ nodeData: { children, options } }) => {
  const [question, ...choices] = children;
  const [selectedResponse, setSelectedResponse] = useState({});
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const questionText = getNestedText(question.children);
  const quizId = options?.['quiz-id'];

  return (
    question?.type === 'paragraph' && (
      <StyledCard>
        <QuizCompleteHeader />
        <QuizCompleteSubtitle question={question.children} />
        {choices.map((node, i) => (
          <ComponentFactory
            nodeData={node}
            key={i}
            idx={i}
            selectedResponseIdx={selectedResponse?.index}
            setSelectedResponse={setSelectedResponse}
            hasSubmitted={hasSubmitted}
          />
        ))}
        {!hasSubmitted && (
          <SubmitButton
            setHasSubmitted={setHasSubmitted}
            selectedResponse={selectedResponse}
            quizResponseObj={createQuizResponseObj(questionText, quizId, 'placeholderproj', selectedResponse)}
          />
        )}
      </StyledCard>
    )
  );
};

QuizWidget.propTypes = {
  nodeData: PropTypes.shape({
    children: PropTypes.arrayOf(PropTypes.object).isRequired,
  }).isRequired,
};

export default QuizWidget;
