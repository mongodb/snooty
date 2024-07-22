import React, { useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import Button from '@leafygreen-ui/button';
import Card from '@leafygreen-ui/card';
import { palette } from '@leafygreen-ui/palette';
import Icon from '@leafygreen-ui/icon';
import ComponentFactory from '../../ComponentFactory';
import { theme } from '../../../theme/docsTheme';
import { useSiteMetadata } from '../../../hooks/use-site-metadata';
import { getPlaintext } from '../../../utils/get-plaintext';
import useSnootyMetadata from '../../../utils/use-snooty-metadata';
import { useRealmFuncs } from './RealmFuncs';
import { RealmAppProvider } from './RealmApp';
import { quizAppId } from './realm-constants';

const StyledCard = styled(Card)`
  background-color: ${palette.gray.light3};
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
  color: ${palette.gray.base};
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
    <Icon glyph="CheckmarkWithCircle" fill={palette.green.base} size="xlarge" />
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
  const { insertDocument } = useRealmFuncs(dbName, 'responses');

  const handleChoiceClick = useCallback(() => {
    if (selectedResponse) {
      setIsSubmitted(true);
      insertDocument(quizResponseObj);
    }
  }, [selectedResponse, setIsSubmitted, insertDocument, quizResponseObj]);

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

// Current workaround to verify there's only one :is-true: flag, parser layer verification will be added later
const verifySingleAnswerCount = (choices) => {
  return choices.filter((c) => !!c.options?.['is-true']).length === 1;
};

const verifyDate = (quizDate) => {
  const verifyDateRegex = new RegExp(/^\d{4}-\d{2}-\d{2}$/);
  return verifyDateRegex.test(quizDate) ? quizDate : null;
};

const unwrappedOptions = (options) => {
  return {
    quizId: options?.['quiz-id'],
    quizDate: verifyDate(options?.['quiz-date']),
  };
};

const QuizWidget = ({ nodeData: { children, options } }) => {
  const [question, ...choices] = children;
  const [selectedResponse, setSelectedResponse] = useState();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { quizId, quizDate } = unwrappedOptions(options);
  const { project } = useSnootyMetadata();
  const shouldRender = verifySingleAnswerCount(choices) && question?.type === 'paragraph';
  return (
    shouldRender && (
      <StyledCard>
        {quizCompleteHeader}
        <QuizCompleteSubtitle question={question.children} />
        {choices.map((node, i) => (
          <ComponentFactory
            nodeData={node}
            key={i}
            idx={i}
            selectedResponse={selectedResponse}
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
