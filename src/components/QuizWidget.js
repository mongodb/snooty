import React from 'react';
import { useState } from 'react';
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

const QuizFooterText = styled('p')`
  margin: 24px 0 0 0 !important;
  color: ${uiColors.gray.dark2};
  font-size: 16px;
  font-weight: 500;
`;

const FooterIconSpan = styled('span')`
  margin-right: 5px;
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

const SubmitButton = ({ setHasSubmitted }) => {
  return (
    <StyledButton onClick={() => setHasSubmitted(true)} variant="default">
      Submit
    </StyledButton>
  );
};

const ResultFooter = () => {
  return (
    <QuizFooterText>
      <FooterIconSpan>
        <Icon glyph="X" fill={uiColors.gray.dark2} size="small" />
      </FooterIconSpan>
      Incorrect Answer
    </QuizFooterText>
  );
};

const QuizWidget = ({ nodeData: { children } }) => {
  const [question, ...choices] = children;
  const [selectedResponse, setSelectedResponse] = useState({});
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const footerWidget = hasSubmitted ? (
    !selectedResponse.isCurrentChoiceCorrect && <ResultFooter />
  ) : (
    <SubmitButton setHasSubmitted={setHasSubmitted} />
  );

  return (
    question?.type === 'paragraph' && (
      <StyledCard>
        <QuizCompleteHeader />
        <QuizCompleteSubtitle question={question.children} />
        {choices.map((node, i) => (
          <ComponentFactory
            nodeData={node}
            key={i}
            idx={i + 1}
            selectedResponse={selectedResponse.index}
            callback={setSelectedResponse}
            hasSubmitted={hasSubmitted}
          />
        ))}
        {footerWidget}
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
