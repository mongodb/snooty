import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import Card from '@leafygreen-ui/card';
import { uiColors } from '@leafygreen-ui/palette';
import Icon from '@leafygreen-ui/icon';
import ComponentFactory from './ComponentFactory';

const StyledCard = styled(Card)`
  box-shadow: none;
  margin: auto auto 16px auto;
  padding: 15px;
  ${(props) => props.selectedThisChoice && `border-color: ${uiColors.black};`}
  ${(props) => (props.hasSubmitted ? `pointer-events: none;` : `&:hover { border-color: black; }`)}
  ${(props) =>
    props.hasSubmitted &&
    (props.isCurrentChoiceCorrect ? `border: 2px solid ${uiColors.green.base};` : `opacity: 0.5;`)}
`;

const Dot = styled('span')`
  height: 10px;
  width: 10px;
  background-color: ${(props) =>
    props.selectedThisChoice && !props.hasSubmitted ? `${uiColors.gray.dark3}` : `white`};
  border-color: black;
  border-radius: 50%;
  display: inline-block;
  border-style: solid;
  border-width: thin;
  margin-right: 16px;
`;

const SyledIcon = styled(Icon)`
  margin-right: 12px;
`;

const DescriptionBody = styled('p')`
  margin-top: 8px !important;
  margin-bottom: 0px !important;
  padding-left: 26px;
`;

const AnswerDescription = ({ description }) => {
  return (
    <DescriptionBody>
      {description.map((node, i) => (
        <ComponentFactory nodeData={node} key={i} />
      ))}
    </DescriptionBody>
  );
};

const CorrectChoice = () => <SyledIcon glyph="Checkmark" fill={uiColors.green.base} size="small" />;
const IncorrectChoice = () => <SyledIcon glyph="X" fill={uiColors.gray.base} size="small" />;
const UnsubmittedChoice = ({ selectedThisChoice, hasSubmitted }) => (
  <Dot selectedThisChoice={selectedThisChoice} hasSubmitted={hasSubmitted} />
);

const ChoiceIconFactory = ({ hasSubmitted, selectedThisChoice, isCurrentChoiceCorrect }) => {
  if (hasSubmitted) return isCurrentChoiceCorrect ? <CorrectChoice /> : <IncorrectChoice />;
  else return <UnsubmittedChoice selectedThisChoice={selectedThisChoice} hasSubmitted={hasSubmitted} />;
};

const QuizChoice = ({ nodeData: { argument, children, options }, selectedResponse, callback, idx, hasSubmitted }) => {
  const description = children[0].children;
  const isCurrentChoiceCorrect = !!options?.['is-true'];
  const selectedThisChoice = selectedResponse === idx;
  return (
    <StyledCard
      isCurrentChoiceCorrect={isCurrentChoiceCorrect}
      selectedThisChoice={selectedThisChoice}
      hasSubmitted={hasSubmitted}
      onClick={() => callback({ index: idx, isCurrentChoiceCorrect: isCurrentChoiceCorrect })}
    >
      <ChoiceIconFactory
        hasSubmitted={hasSubmitted}
        selectedThisChoice={selectedThisChoice}
        isCurrentChoiceCorrect={isCurrentChoiceCorrect}
      />
      {argument.map((node, i) => (
        <ComponentFactory nodeData={node} key={i} />
      ))}
      {hasSubmitted && <AnswerDescription description={description} />}
    </StyledCard>
  );
};

QuizChoice.propTypes = {
  nodeData: PropTypes.shape({
    children: PropTypes.arrayOf(PropTypes.object).isRequired,
  }).isRequired,
};

export default QuizChoice;
