import React, { useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import Button from '@leafygreen-ui/button';
import Card from '@leafygreen-ui/card';
import { uiColors } from '@leafygreen-ui/palette';
import Icon from '@leafygreen-ui/icon';
import ComponentFactory from '../../ComponentFactory';
import { theme } from '../../../theme/docsTheme';
import { useSiteMetadata } from '../../../hooks/use-site-metadata';
import { getPlaintext } from '../../../utils/get-plaintext';
import { useRealmFuncs } from './RealmFuncs';
import { RealmAppProvider } from './RealmApp';
import { quizAppId } from './realm.json';

const StyledCard = styled(Card)`
  background-color: ${uiColors.gray.light3};
  width: 100%;
  padding: 40px;
`;

const QuizTitle = styled('p')`
  margin: 0 0 ${theme.size.large} 0 !important;
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
  font-size: ${theme.fontSize.small};
  line-height: 16.59px;
  color: ${uiColors.gray.base};
  margin: 0 !important;
`;

const QuizQuestion = styled('p')`
  margin: ${theme.size.small} 0 ${theme.size.medium} 0 !important;
`;

const StyledButton = styled(Button)`
  font-size: ${theme.fontSize.default};
`;

const quizCompleteHeader = (
  <QuizHeader>
    <Icon glyph="CheckmarkWithCircle" fill={uiColors.green.base} size="xlarge" />
    <QuizTitle>Check your understanding</QuizTitle>
  </QuizHeader>
);

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

const SubmitButton = ({ setIsSubmitted, selectedResponse, quizResponseObj }) => {
  const { snootyEnv } = useSiteMetadata();
  const dbName = snootyEnv === 'production' ? 'quiz_prod' : 'quiz_dev';
  const { addResponse } = useRealmFuncs(dbName, 'responses');

  const handleChoiceClick = useCallback(() => {
    if (selectedResponse) {
      setIsSubmitted(true);
      addResponse(quizResponseObj);
    }
  }, [selectedResponse, setIsSubmitted, addResponse, quizResponseObj]);

  return (
    <StyledButton onClick={handleChoiceClick} variant="default">
      Submit
    </StyledButton>
  );
};

const createQuizResponseObj = (question, quizId, selectedResponse, project, quizDate) => {
  return {
    ...selectedResponse,
    questionText: getPlaintext(question.children),
    quizId: quizId,
    project: project,
    timestamp: new Date(),
    quizDate: quizDate,
  };
};

const QuizWidget = ({ nodeData: { children, options } }) => {
  const [question, ...choices] = children;
  const [selectedResponse, setSelectedResponse] = useState();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const quizId = options?.['quiz-id'];
  const quizDate = options?.['quiz-date'];
  const { project } = useSiteMetadata();
  return (
    question?.type === 'paragraph' && (
      <StyledCard>
        {quizCompleteHeader}
        <QuizCompleteSubtitle question={question.children} />
        {choices.map((node, i) => (
          <ComponentFactory
            nodeData={node}
            key={i}
            idx={i}
            selectedResponseIdx={selectedResponse?.index}
            setSelectedResponse={setSelectedResponse}
            isSubmitted={isSubmitted}
          />
        ))}
        {!isSubmitted && (
          <RealmAppProvider appId={quizAppId}>
            <SubmitButton
              setIsSubmitted={setIsSubmitted}
              selectedResponse={selectedResponse}
              quizResponseObj={createQuizResponseObj(question, quizId, selectedResponse, project, quizDate)}
            />
          </RealmAppProvider>
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
