import React from 'react';
import PropTypes from 'prop-types';
import { css } from '@emotion/core';
import styled from '@emotion/styled';
import Card from '@leafygreen-ui/card';
import { uiColors } from '@leafygreen-ui/palette';
import Icon from '@leafygreen-ui/icon';
import ComponentFactory from './ComponentFactory';
import { getNestedText } from '../utils/get-nested-text';

const submittedChoiceStyle = css`
  pointer-events: none;
  transition: unset !important;
`;

const StyledCard = styled(Card)`
  box-shadow: none;
  margin: auto auto 16px auto;
  padding: 15px;
  ${(props) => props.selectedthischoice && `border-color: ${uiColors.black};`}
  ${(props) => (props.hassubmitted ? submittedChoiceStyle : `&:hover { border-color: black; }`)}
  ${(props) =>
    props.hassubmitted &&
    (props.iscurrentchoicecorrect ? `border: 2px solid ${uiColors.green.base};` : `opacity: 0.5;`)}
`;

const Dot = styled('span')`
  height: 10px;
  width: 10px;
  background-color: ${(props) =>
    props.selectedthischoice && !props.hassubmitted ? `${uiColors.gray.dark3}` : `white`};
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
const UnsubmittedChoice = ({ selectedthischoice, hassubmitted }) => (
  <Dot selectedthischoice={selectedthischoice} hassubmitted={hassubmitted} />
);

const ChoiceIconFactory = ({ hassubmitted, selectedthischoice, iscurrentchoicecorrect }) => {
  if (hassubmitted) return iscurrentchoicecorrect ? <CorrectChoice /> : <IncorrectChoice />;
  else return <UnsubmittedChoice selectedthischoice={selectedthischoice} hassubmitted={hassubmitted} />;
};

const QuizChoice = ({
  nodeData: { argument, children, options },
  selectedResponseIdx,
  setSelectedResponse,
  idx,
  hassubmitted,
}) => {
  const description = children[0].children;
  const iscurrentchoicecorrect = !!options?.['is-true'];
  const selectedthischoice = selectedResponseIdx === idx;
  const responseText = getNestedText(argument);
  return (
    <StyledCard
      iscurrentchoicecorrect={iscurrentchoicecorrect ? 1 : 0}
      selectedthischoice={selectedthischoice ? 1 : 0}
      hassubmitted={hassubmitted ? 1 : 0}
      onClick={() =>
        !selectedthischoice
          ? setSelectedResponse({ responseIndex: idx, responseText: responseText, isCorrect: iscurrentchoicecorrect })
          : setSelectedResponse()
      }
    >
      <ChoiceIconFactory
        hassubmitted={hassubmitted}
        selectedthischoice={selectedthischoice}
        iscurrentchoicecorrect={iscurrentchoicecorrect}
      />
      {argument.map((node, i) => (
        <ComponentFactory nodeData={node} key={i} />
      ))}
      {hassubmitted && <AnswerDescription description={description} />}
    </StyledCard>
  );
};

QuizChoice.propTypes = {
  nodeData: PropTypes.shape({
    children: PropTypes.arrayOf(PropTypes.object).isRequired,
  }).isRequired,
  selectedResponseIdx: PropTypes.number,
  setSelectedResponse: PropTypes.func,
  idx: PropTypes.number,
  hassubmitted: PropTypes.bool,
};

export default QuizChoice;
